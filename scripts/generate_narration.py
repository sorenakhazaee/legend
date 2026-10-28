
import os
import json
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI


# ============================================================
# تنظیمات اصلی
# ============================================================

load_dotenv()

API_KEY = os.getenv("ONEXAI_API_KEY")

if not API_KEY:
    raise RuntimeError(
        "کلید ONEXAI_API_KEY در فایل .env پیدا نشد."
    )

client = OpenAI(
    api_key=API_KEY,
    base_url="https://1xai.ir/v1",
)

MODEL = "gpt-4o-mini-tts"

OUTPUT_DIR = Path("narration/voices")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# ============================================================
# دستورهای صوتی شخصیت‌ها
# ============================================================

GORDAFARID_INSTRUCTIONS = """
Speak in Persian (Farsi) with natural Persian pronunciation.

You are Gordafarid, a young female storyteller narrating
a magical fairy tale for a birthday film.

Aim for a youthful, childlike, light, gentle, naturally
high-pitched feminine voice.

Your storytelling is warm, curious, innocent, expressive,
and filled with wonder. Use subtle emotional changes
according to the meaning of the dialogue.

Speak clearly and naturally in Persian. Use gentle pauses
at commas, full stops, and dramatic moments.

Avoid a mature, deep, formal, or overly theatrical delivery.
Do not sing. Do not add sound effects.
Speak only the supplied dialogue. Do not add extra words.
"""

HIRBOD_INSTRUCTIONS = """
Speak in Persian (Farsi) with natural Persian pronunciation.

You are Hirbod, a young male storyteller narrating
a magical fairy tale for a birthday film.

Aim for a youthful, childlike, light, gentle masculine voice
with a naturally youthful tone.

Your storytelling is warm, curious, innocent, expressive,
and filled with wonder. Use subtle emotional changes
according to the meaning of the dialogue.

Speak clearly and naturally in Persian. Use gentle pauses
at commas, full stops, and dramatic moments.

Avoid a mature, deep, formal, or overly theatrical delivery.
Do not sing. Do not add sound effects.
Speak only the supplied dialogue. Do not add extra words.
"""

NARRATOR_INSTRUCTIONS = """
Speak in Persian (Farsi) with natural Persian pronunciation.

You are the narrator of a magical, cinematic fairy tale.
Use a calm, warm, clear storytelling voice with a sense
of mystery, wonder, and emotional depth.

The narration should feel suitable for a beautiful
birthday film. Use natural pacing and meaningful pauses.

Avoid newsreader delivery, exaggerated drama, and singing.
Speak only the supplied dialogue. Do not add extra words.
"""

ENDING_INSTRUCTIONS = """
Speak in Persian (Farsi) with natural Persian pronunciation.

This is the final birthday message of a heartfelt,
magical fairy tale. Use a gentle, tender, sincere,
warm and emotional delivery.

Slow down slightly for meaningful phrases.
Allow natural pauses between sentences.
The final birthday wish should sound hopeful and luminous.

Do not sing. Do not add sound effects.
Speak only the supplied Persian text.
"""


# ============================================================
# صدای پایه‌ی هر شخصیت
# ============================================================

CHARACTERS = {
    "gordafarid": {
        "name": "گردآفرید",
        "voice": "nova",
        "instructions": GORDAFARID_INSTRUCTIONS,
    },
    "hirbod": {
        "name": "هیربد",
        "voice": "alloy",
        "instructions": HIRBOD_INSTRUCTIONS,
    },
    "narrator": {
        "name": "راوی",
        "voice": "nova",
        "instructions": NARRATOR_INSTRUCTIONS,
    },
    "ending": {
        "name": "پایان تولد",
        "voice": "nova",
        "instructions": ENDING_INSTRUCTIONS,
    },
}


# ============================================================
# متن کامل افسانه‌ی لیان
#
# هر عضو این فهرست یک فایل صوتی مستقل تولید می‌کند.
# ترتیب فهرست، ترتیب فایل‌های خروجی را تعیین می‌کند.
# ============================================================

DIALOGUES = [
    # --------------------------------------------------------
    # پرده‌ی اول — سال‌های تاریکی
    # --------------------------------------------------------

    {
        "scene": "01",
        "character": "gordafarid",
        "text": "سلام خانمی! من گردآفریدم.",
    },
    {
        "scene": "01",
        "character": "hirbod",
        "text": (
            "سلام سید خانم! منم هیربدم. "
        ),
    },
    {
        "scene": "01",
        "character": "gordafarid",
        "text": (
            "ما خواهر و برادریم؛ "
            "از جنس افسانه‌ها و یادگار روزگار اسطوره‌ها. "
        ),
    },
    {
        "scene": "01",
        "character": "hirbod",
        "text": "اومدیم تا داستانی رو برات روایت کنیم؛"
                "داستانی از دل تاریخ، آمیخته با راز و افسانه."
    },
    {
        "scene": "01",
        "character": "gordafarid",
        "text": "خب، سید خانم... اجازه می‌دی قصه‌مون رو شروع کنیم؟",
    },
]


# ============================================================
# تولید یک فایل صوتی مستقل
# ============================================================

def generate_dialogue(index, dialogue):
    character_key = dialogue["character"].strip().lower()
    text = dialogue["text"].strip()

    if character_key not in CHARACTERS:
        raise ValueError(
            f"شخصیت ناشناخته در دیالوگ {index}: {character_key}"
        )

    if not text:
        raise ValueError(f"متن دیالوگ {index} خالی است.")

    character = CHARACTERS[character_key]

    filename = (
        f"{index:03d}_scene_{dialogue['scene']}_"
        f"{character_key}.mp3"
    )

    output_path = OUTPUT_DIR / filename

    # فایل موجود را دوباره تولید نمی‌کنیم.
    if output_path.exists():
        print(f"قبلاً تولید شده؛ رد شد: {filename}")

        return {
            "index": index,
            "scene": dialogue["scene"],
            "character": character_key,
            "text": text,
            "file": filename,
            "status": "skipped",
        }

    print(
        f"\n[{index}/{len(DIALOGUES)}] "
        f"{character['name']} | پرده {dialogue['scene']}"
    )

    try:
        response = client.audio.speech.create(
            model=MODEL,
            voice=character["voice1"],
            input=text,
            instructions=character["instructions"],
            response_format="mp3",
        )

        response.stream_to_file(output_path)

    except Exception:
        # اگر تولید یا ذخیره ناقص بود، فایل ناقص باقی نماند.
        if output_path.exists():
            output_path.unlink()
        raise

    print(f"ذخیره شد: {filename}")

    return {
        "index": index,
        "scene": dialogue["scene"],
        "character": character_key,
        "text": text,
        "file": filename,
        "status": "success",
    }


# ============================================================
# اجرای کل داستان
# ============================================================

def main():
    results = []

    total = len(DIALOGUES)

    print(f"تعداد کل دیالوگ‌ها: {total}")
    print("تولید صداها آغاز شد.")

    for index, dialogue in enumerate(DIALOGUES, start=1):
        try:
            result = generate_dialogue(index, dialogue)
        except Exception as error:
            print(f"خطا در دیالوگ {index}: {error}")

            result = {
                "index": index,
                "scene": dialogue.get("scene"),
                "character": dialogue.get("character"),
                "text": dialogue.get("text"),
                "status": "failed",
                "error": str(error),
            }

        results.append(result)

        # بعد از هر دیالوگ گزارش ذخیره می‌شود.
        manifest_path = OUTPUT_DIR / "manifest.json"
        manifest_path.write_text(
            json.dumps(
                results,
                ensure_ascii=False,
                indent=2,
            ),
            encoding="utf-8",
        )

    successful = sum(
        item["status"] == "success"
        for item in results
    )

    skipped = sum(
        item["status"] == "skipped"
        for item in results
    )

    failed = sum(
        item["status"] == "failed"
        for item in results
    )

    print("\n" + "=" * 50)
    print("پایان پردازش داستان افسانه‌ی لیان")
    print(f"تعداد دیالوگ‌ها: {total}")
    print(f"تولید موفق: {successful}")
    print(f"از قبل موجود: {skipped}")
    print(f"ناموفق: {failed}")
    print(f"پوشه خروجی: {OUTPUT_DIR.resolve()}")


if __name__ == "__main__":
    main()
