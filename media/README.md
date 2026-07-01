# TriScreen — סרטון מוצר ויראלי

`TriScreen_viral.mp4` — סרטון אנכי 1080×1920, ‏~21.8 שניות, 30fps, H.264 + AAC.
בנוי לפרסום ב‑Reels / TikTok / Shorts.

## מבנה (8 סצנות)
1. וו פתיחה — "עדיין עובד על מסך אחד?"
2. הצגת המוצר — TriScreen Pro 15.6״
3. ‏3× יותר שטח עבודה
4. ‏USB-C אחד · 10 שניות הרכבה
5. מפרט — 15.6״ · Full HD · 1.3 ק״ג
6. תאימות — Mac · Windows · Linux
7. ביקורת חמישה כוכבים
8. מבצע — 1,099 ₪ + קריאה לפעולה

## עריכה מחדש
המקורות ב‑`video-source/`. הטקסטים והעיצוב ב‑`scenes.html`
(רינדור עם הפונט Heebo, RTL). לבנייה מחדש:

```bash
node video-source/shoot.js      # מרנדר את 8 הסצנות ל‑PNG (Chromium/Playwright)
bash video-source/build.sh      # מרכיב אנימציה + מעברים + פס קול ל‑mp4
```

הפס קול הוא אמביינט עדין — מומלץ להחליף בסאונד טרנדי בתוך TikTok/Reels כדי למקסם הגעה.
