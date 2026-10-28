
import os
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

api_key = os.getenv("ONEXAI_API_KEY")
if not api_key:
    raise RuntimeError("کلید API در فایل .env تنظیم نشده است.")

client = OpenAI(
    api_key=api_key,
    base_url="https://1xai.ir/v1",
)

output_dir = Path(__file__).resolve().parent.parent / "narration" / "voice_tests"
output_dir.mkdir(parents=True, exist_ok=True)

test_text = "سال‌ها بود که زمین، طلوع را به یاد نمی‌آورد."

voices = ["alloy", "nova", "shimmer", "coral", "fable"]

for voice in voices:
    output_file = output_dir / f"{voice}.mp3"

    try:
        with client.audio.speech.with_streaming_response.create(
            model="gpt-4o-mini-tts",
            voice=voice,
            input=test_text,
            instructions=(
                "Speak in Persian. Use a natural, youthful "
                "childlike storytelling voice, with gentle emotion "
                "and clear pronunciation. Avoid exaggerated acting."
            ),
            response_format="mp3",
        ) as response:
            response.stream_to_file(output_file)

        print(f"Saved: {output_file}")

    except Exception as error:
        print(f"Failed for voice '{voice}': {error}")