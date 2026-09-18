"""
Prepare the case study GIFs for the website.

Run this after adding or replacing any GIF in public/images/BL Loyalty/:

    python3 scripts/prepare-gifs.py

It does two things to every GIF in that folder:

1. Fixes a stuck last frame. The export tool sometimes leaves the final frame
   on screen for minutes before the loop restarts, which makes the clip look
   frozen. Any frame held longer than 5 seconds is shortened to 1 second.

2. Makes a still. Each clip gets a "<name>-still.gif" beside it, holding just
   its first frame. The slider shows these on the slides either side of the
   middle one (a GIF can't be paused), and they stand in while the full clip
   loads, which keeps the page light.

Nothing else in the file is touched — the frames themselves are untouched.
"""

import struct
import sys
from pathlib import Path

FOLDER = Path(__file__).resolve().parent.parent / "public" / "images" / "BL Loyalty"
STILL_SUFFIX = "-still.gif"
MAX_FRAME_CENTISECONDS = 500  # 5s — anything longer is the export glitch
REPLACEMENT_CENTISECONDS = 100  # hold the last frame 1s, then loop


def frame_delay_offsets(data: bytes):
    """Byte positions of every frame's delay value."""
    offsets, i = [], 0
    while True:
        i = data.find(b"\x21\xf9\x04", i)
        if i < 0:
            return offsets
        offsets.append(i + 4)
        i += 8


def fix_stuck_frames(path: Path) -> int:
    data = bytearray(path.read_bytes())
    fixed = 0
    for offset in frame_delay_offsets(data):
        (delay,) = struct.unpack_from("<H", data, offset)
        if delay > MAX_FRAME_CENTISECONDS:
            struct.pack_into("<H", data, offset, REPLACEMENT_CENTISECONDS)
            fixed += 1
    if fixed:
        path.write_bytes(data)
    return fixed


def first_frame(data: bytes) -> bytes:
    """A valid single-frame GIF holding just frame 1 of `data`."""
    if data[:3] != b"GIF":
        raise ValueError("not a GIF")
    packed = data[10]
    pos = 13
    if packed & 0x80:  # global colour table
        pos += 3 * (2 ** ((packed & 0x07) + 1))
    out = bytearray(data[:pos])  # header + screen descriptor + palette

    while pos < len(data):
        block = data[pos]
        if block == 0x21:  # extension block — copy across untouched
            start = pos
            pos += 2
            while True:
                size = data[pos]
                pos += 1
                if size == 0:
                    break
                pos += size
            out += data[start:pos]
        elif block == 0x2C:  # image descriptor — the frame itself
            start = pos
            local = data[start + 9]
            pos += 10
            if local & 0x80:  # local colour table
                pos += 3 * (2 ** ((local & 0x07) + 1))
            pos += 1  # LZW minimum code size
            while True:
                size = data[pos]
                pos += 1
                if size == 0:
                    break
                pos += size
            out += data[start:pos]
            out += b"\x3B"  # trailer — stop after one frame
            return bytes(out)
        else:
            break
    raise ValueError("no image frame found")


def seconds_per_loop(data: bytes) -> float:
    return sum(
        struct.unpack_from("<H", data, o)[0] for o in frame_delay_offsets(data)
    ) / 100


def main() -> int:
    if not FOLDER.is_dir():
        print(f"Folder not found: {FOLDER}")
        return 1

    clips = sorted(
        p for p in FOLDER.glob("*.gif") if not p.name.endswith(STILL_SUFFIX)
    )
    if not clips:
        print(f"No GIFs found in {FOLDER}")
        return 1

    for clip in clips:
        fixed = fix_stuck_frames(clip)
        data = clip.read_bytes()
        still = clip.with_name(clip.stem + STILL_SUFFIX)
        still.write_bytes(first_frame(data))
        note = f"  (shortened {fixed} stuck frame{'s' if fixed > 1 else ''})" if fixed else ""
        print(
            f"{clip.name:26s} {len(data) / 1e6:5.1f} MB  "
            f"loops every {seconds_per_loop(data):4.1f}s  "
            f"still: {still.stat().st_size / 1000:4.0f} KB{note}"
        )

    print("\nSet each slide's `seconds` in src/content/brightlineLoyalty.ts to")
    print("its loop time above, so the clip plays through once per slide.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
