// Turns a screen recording (.mov, .mp4 — whatever QuickTime gave you) into a
// small, web-ready MP4.
//
// A recording straight off the screen is recorded for quality, not for
// downloading: it is far bigger than it needs to be, it is often twice the size
// it will ever be shown at, and the index browsers need to start playing sits
// at the END of the file, so the whole thing has to arrive before anything
// moves. This fixes all three.
//
// Everything here is built into macOS: AVFoundation reads and writes, Core
// Image does the scaling. Nothing to install.
//
// Usage:
//   swift scripts/video-to-web.swift <input> <output.mp4> [maxWidth] [bitrate]
//
//   maxWidth   widest the output may be, in pixels. Taller-than-wide videos are
//              scaled to this width. Default 640, which covers a phone mockup
//              on a retina screen.
//   bitrate    bits per second. Higher is better looking and bigger. Default
//              900000, which suits a screen recording of a mostly-still UI.

import AVFoundation
import CoreImage
import Foundation

let args = CommandLine.arguments
guard args.count >= 3 else {
    print("usage: swift scripts/video-to-web.swift <input> <output.mp4> [maxWidth] [bitrate]")
    exit(1)
}

let inputURL = URL(fileURLWithPath: args[1])
let outputURL = URL(fileURLWithPath: args[2])
let maxWidth = args.count > 3 ? Int(args[3]) ?? 640 : 640
let bitrate = args.count > 4 ? Int(args[4]) ?? 900_000 : 900_000

try? FileManager.default.removeItem(at: outputURL)

let asset = AVURLAsset(url: inputURL)
guard let track = asset.tracks(withMediaType: .video).first else {
    print("no video track in \(inputURL.path)")
    exit(1)
}

// The recording may carry a rotation. Applying it here gives us the size the
// video actually looks like, not the size it happens to be stored as.
let natural = track.naturalSize.applying(track.preferredTransform)
let sourceWidth = abs(natural.width)
let sourceHeight = abs(natural.height)

// Never scale UP — a bigger file that looks identical helps nobody.
let scale = min(1.0, Double(maxWidth) / sourceWidth)
// H.264 needs even dimensions.
func even(_ value: Double) -> Int {
    let rounded = Int(value.rounded())
    return rounded - (rounded % 2)
}
let width = even(sourceWidth * scale)
let height = even(sourceHeight * scale)

let reader = try AVAssetReader(asset: asset)
let readerOutput = AVAssetReaderTrackOutput(
    track: track,
    outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA]
)
readerOutput.alwaysCopiesSampleData = false
reader.add(readerOutput)

let writer = try AVAssetWriter(outputURL: outputURL, fileType: .mp4)
// Puts the index at the front of the file so it can start playing while it is
// still downloading, rather than waiting for the whole thing.
writer.shouldOptimizeForNetworkUse = true

let writerInput = AVAssetWriterInput(
    mediaType: .video,
    outputSettings: [
        AVVideoCodecKey: AVVideoCodecType.h264,
        AVVideoWidthKey: width,
        AVVideoHeightKey: height,
        AVVideoCompressionPropertiesKey: [
            AVVideoAverageBitRateKey: bitrate,
            AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
            AVVideoAllowFrameReorderingKey: true,
            // A keyframe every second or so, so the browser can start playing
            // and seek without having to rebuild from the very beginning.
            AVVideoMaxKeyFrameIntervalDurationKey: 1.0,
        ],
    ]
)
writerInput.expectsMediaDataInRealTime = false

let adaptor = AVAssetWriterInputPixelBufferAdaptor(
    assetWriterInput: writerInput,
    sourcePixelBufferAttributes: [
        kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
        kCVPixelBufferWidthKey as String: width,
        kCVPixelBufferHeightKey as String: height,
    ]
)

writer.add(writerInput)
writer.startWriting()
writer.startSession(atSourceTime: .zero)
reader.startReading()

let ciContext = CIContext()
var written = 0
var lastTime = CMTime.zero

while let sample = readerOutput.copyNextSampleBuffer() {
    guard let sourceBuffer = CMSampleBufferGetImageBuffer(sample) else { continue }

    while !writerInput.isReadyForMoreMediaData {
        usleep(2000)
    }

    guard let pool = adaptor.pixelBufferPool else { break }
    var buffer: CVPixelBuffer?
    CVPixelBufferPoolCreatePixelBuffer(nil, pool, &buffer)
    guard let destination = buffer else { break }

    // Orient the frame the way it is meant to be seen, then scale it down.
    let image = CIImage(cvPixelBuffer: sourceBuffer)
        .transformed(by: track.preferredTransform)
    // Rotating can leave the picture away from the origin; pull it back.
    let placed = image.transformed(
        by: CGAffineTransform(translationX: -image.extent.origin.x, y: -image.extent.origin.y)
    )
    let scaled = placed.transformed(by: CGAffineTransform(scaleX: scale, y: scale))

    ciContext.render(scaled, to: destination)

    let time = CMSampleBufferGetPresentationTimeStamp(sample)
    adaptor.append(destination, withPresentationTime: time)
    lastTime = time
    written += 1
}

writerInput.markAsFinished()

let done = DispatchSemaphore(value: 0)
writer.finishWriting { done.signal() }
done.wait()

if writer.status == .completed {
    let bytes = (try? FileManager.default.attributesOfItem(atPath: outputURL.path)[.size]) as? Int ?? 0
    let mb = Double(bytes) / 1024 / 1024
    print(String(format: "%@  %d frames, %.1fs, %dx%d, %.2f MB",
                 outputURL.lastPathComponent, written, lastTime.seconds, width, height, mb))
} else {
    print("failed: \(writer.error?.localizedDescription ?? "unknown error")")
    exit(1)
}
