from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.db import transaction
from django.utils import timezone
from datetime import timedelta

from articles.models import Article, Tag
from comments.models import Comment


class Command(BaseCommand):
    help = "Seed realistic Hebrew blog data"

    @transaction.atomic
    def handle(self, *args, **options):

        # ניקוי מלא
        Comment.objects.all().delete()
        Article.objects.all().delete()
        Tag.objects.all().delete()

        # משתמשים (לא מוסיפים מעבר לדרישה)
        admin, _ = User.objects.get_or_create(
            username="admin_seed",
            defaults={
                "email": "admin_seed@example.com",
                "is_staff": True,
                "is_superuser": True,
                "is_active": True,
            },
        )
        admin.set_password("admin123456")
        admin.save()

        user, _ = User.objects.get_or_create(
            username="user_seed",
            defaults={
                "email": "user_seed@example.com",
                "is_active": True,
            },
        )
        user.set_password("123456")
        user.save()

        # תגיות
        tech = Tag.objects.create(name="טכנולוגיה")
        dev = Tag.objects.create(name="פיתוח")
        life = Tag.objects.create(name="למידה")
        web = Tag.objects.create(name="ווב")

        now = timezone.now()

        articles_data = [
            ("איך להתחיל ללמוד תכנות מאפס",
             "אחד האתגרים הגדולים ביותר למתחילים הוא לדעת מאיפה להתחיל. חשוב לבחור שפה אחת, להתמיד ולהתנסות בפרויקטים קטנים."),
            ("למה פרויקטים מעשיים חשובים יותר מתיאוריה",
             "קריאה היא חשובה, אבל ללא תרגול אמיתי קשה מאוד להפנים את החומר. בניית פרויקטים מחזקת הבנה."),
            ("המעבר מפיתוח מקומי לסביבת Production",
             "הרבה מפתחים נתקלים בפער בין סביבת פיתוח מקומית לבין סביבת ייצור. חשוב להבין ניהול סביבה נכון."),
            ("איך לכתוב קוד נקי וקריא",
             "קוד קריא חוסך זמן עתידי. שמות משתנים ברורים ומבנה נכון חשובים לא פחות מהלוגיקה עצמה."),
            ("טעויות נפוצות של מפתחים מתחילים",
             "ריצה מהירה מדי, חוסר בדיקות, וחוסר הבנה עמוקה של הבסיס הן טעויות נפוצות בתחילת הדרך."),
            ("REST API – עקרונות בסיסיים",
             "API טוב בנוי בצורה עקבית וברורה. שימוש נכון בסטטוסים ו־endpoints הוא קריטי."),
            ("חשיבות אבטחת מידע באפליקציות ווב",
             "JWT, הרשאות, ולידציה בצד שרת הם מרכיבים חיוניים באבטחת מערכת."),
            ("איך להתכונן לראיון עבודה בפיתוח",
             "מעבר על פרויקטים אישיים והבנתם לעומק חשובים יותר מלזכור שאלות תיאורטיות."
             ),
        ]

        created_articles = []

        for i, (title, content) in enumerate(articles_data):
            article = Article.objects.create(
                title=title,
                content=content,
                author_name="admin_seed",
                published_at=now - timedelta(days=i)
            )

            if i % 2 == 0:
                article.tags.set([tech, dev])
            else:
                article.tags.set([life, web])

            created_articles.append(article)

        # תגובות – 2 לכל כתבה
        for article in created_articles:
            Comment.objects.create(
                article=article,
                user=user,
                content="פוסט מעולה, תודה על השיתוף!"
            )
            Comment.objects.create(
                article=article,
                user=admin,
                content="שמח לשמוע שעזר 🙂"
            )

        self.stdout.write(self.style.SUCCESS("Seed completed successfully"))
        self.stdout.write("Login with EMAIL + password:")
        self.stdout.write("admin_seed@example.com / admin123456")
        self.stdout.write("user_seed@example.com  / 123456")
