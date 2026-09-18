// Turns an animated GIF into an MP4 video of the same size and timing.
//
// A GIF stores nearly every frame in full. Video stores what CHANGED between
// frames, which for a screen recording is very little — so the file comes out
// far smaller with no visible difference.
//
// Everything here is built into macOS: ImageIO reads the GIF frame by frame
// with its timings, AVFoundation writes the video. Nothing to install.
//
// Usage:
//   swift scripts/gif-to-video.swift <input.gif> <output.mp4> [bitrate]

import AVFoundation
import CoreGraphics
import Foundation
import ImageIO

let args = CommandLine.arguments
guard args.count >= 3 else {
    print("usage: swift scripts/gif-to-video.swift <input.gif> <output.mp4> [bitrate]")
    exit(1)
}

let inputURL = URL(fileURLWithPath: args[1])
let outputURL = URL(fileURLWithPath: args[2])
let bitrate = args.count > 3 ? Int(args[3]) ?? 1_400_000 : 1_400_000

try? FileManager.default.removeItem(at: outputURL)

guard let source = CGImageSourceCreateWithURL(inputURL as CFURL, nil) else {
    print("could not read \(inputURL.path)")
    exit(1)
}

let frameCount = CGImageSourceGetCount(source)
guard frameCount > 0, let first = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
    print("no frames found in \(inputURL.path)")
    exit(1)
}

// H.264 needs even dimensions
let width = first.width - (first.width % 2)
let height = first.height - (first.height % 2)

/// How long this frame stays on screen, in seconds.
func delay(at index: Int) -> Double {
    guard
        let props = CGImageSourceCopyPropertiesAtIndex(source, index, nil) as? [CFString: Any],
        let gif = props[kCGImagePropertyGIFDictionary] as? [CFString: Any]
    else { return 0.1 }

    let unclamped = gif[kCGImagePropertyGIFUnclampedDelayTime] as? Double
    let clamped = gif[kCGImagePropertyGIFDelayTime] as? Double
    let seconds = unclamped ?? clamped ?? 0.1
    // Browsers treat anything under about 0.02s as 0.1s, so match that
    return seconds < 0.02 ? 0.1 : seconds
}

let writer = try AVAssetWriter(outputURL: outputURL, fileType: .mp4)
// Puts the index at the front of the file so it can start playing while it
// is still downloading, rather than waiting for the whole thing.
writer.shouldOptimizeForNetworkUse = true

let input = AVAssetWriterInput(
    mediaType: .video,
    outputSettings: [
        AVVideoCodecKey: AVVideoCodecType.h264,
        AVVideoWidthKey: width,
        AVVideoHeightKey: height,
        AVVideoCompressionPropertiesKey: [
            AVVideoAverageBitRateKey: bitrate,
            AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
            AVVideoAllowFrameReorderingKey: true,
        ],
    ]
)
input.expectsMediaDataInRealTime = false

let adaptor = AVAssetWriterInputPixelBufferAdaptor(
    assetWriterInput: input,
    sourcePixelBufferAttributes: [
        kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
        kCVPixelBufferWidthKey as String: width,
        kCVPixelBufferHeightKey as String: height,
    ]
)

writer.add(input)
writer.startWriting()
writer.startSession(atSourceTime: .zero)

let timescale: CMTimeScale = 600
var elapsed = 0.0
var written = 0

for index in 0..<frameCount {
    guard let frame = CGImageSourceCreateImageAtIndex(source, index, nil) else { continue }

    while !input.isReadyForMoreMediaData {
        usleep(2000)
    }

    guard let pool = adaptor.pixelBufferPool else { break }
    var buffer: CVPixelBuffer?
    CVPixelBufferPoolCreatePixelBuffer(nil, pool, &buffer)
    guard let pixelBuffer = buffer else { break }

    CVPixelBufferLockBaseAddress(pixelBuffer, [])
    if let context = CGContext(
        data: CVPixelBufferGetBaseAddress(pixelBuffer),
        width: width,
        height: height,
        bitsPerComponent: 8,
        bytesPerRow: CVPixelBufferGetBytesPerRow(pixelBuffer),
        space: CGColorSpaceCreateDeviceRGB(),
        bitmapInfo: CGImageAlphaInfo.noneSkipFirst.rawValue
            | CGBitmapInfo.byteOrder32Little.rawValue
    ) {
        context.draw(frame, in: CGRect(x: 0, y: 0, width: width, height: height))
    }
    CVPixelBufferUnlockBaseAddress(pixelBuffer, [])

    adaptor.append(pixelBuffer, withPresentationTime: CMTime(seconds: elapsed, preferredTimescale: timescale))
    elapsed += delay(at: index)
    written += 1
}

input.markAsFinished()

let done = DispatchSemaphore(value: 0)
writer.finishWriting { done.signal() }
done.wait()

if writer.status == .completed {
    let bytes = (try? FileManager.default.attributesOfItem(atPath: outputURL.path)[.size]) as? Int ?? 0
    let mb = Double(bytes) / 1024 / 1024
    print(String(format: "%@  %d frames, %.1fs, %dx%d, %.2f MB",
                 outputURL.lastPathComponent, written, elapsed, width, height, mb))
} else {
    print("failed: \(writer.error?.localizedDescription ?? "unknown error")")
    exit(1)
}
