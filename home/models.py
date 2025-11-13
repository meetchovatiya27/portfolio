from django.db import models

class HeroSection(models.Model):
    name = models.CharField(max_length=100)
    name_color = models.CharField(
        max_length=7,
        default="",
        help_text="Enter HEX color for your name, e.g. #be123c"
    )
    role = models.CharField(max_length=100)
    tagline = models.TextField()  
    resume_file = models.FileField(upload_to='resumes/')

    # Social icons and URLs
    linkedin_icon = models.ImageField(upload_to='social_icons/', blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)

    github_icon = models.ImageField(upload_to='social_icons/', blank=True, null=True)
    github_url = models.URLField(blank=True, null=True)

    instagram_icon = models.ImageField(upload_to='social_icons/', blank=True, null=True)
    instagram_url = models.URLField(blank=True, null=True)

    location = models.CharField(max_length=100, default="Rajkot")
    available_for_work = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class About(models.Model):
    name = models.CharField(max_length=100, default="Meet Chovatiya")
    profile_image = models.ImageField(upload_to='profile_images/')
    education = models.CharField(max_length=255, default="Atmiya University, 2023–2026")
    about_text = models.TextField()

    def __str__(self):
        return self.name

class Skill(models.Model):
    about = models.ForeignKey(About, related_name="skills", on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    icon = models.ImageField(upload_to='skills/')  

    def __str__(self):
        return self.name
    
from django.db import models

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='projects/')
    github = models.URLField()
    demo = models.URLField(blank=True, null=True)
    badges = models.JSONField(default=list)  # ["React", "Django", "Tailwind"]

    def __str__(self):
        return self.title

class Experience(models.Model):
    company_name = models.CharField(max_length=200)
    position = models.CharField(max_length=100)
    year = models.CharField(max_length=20)  # e.g., "2023-24"
    languages = models.CharField(max_length=200, blank=True)
    duration = models.CharField(max_length=100)  # e.g., "3 months"
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.company_name} - {self.position}"

class Testimonial(models.Model):
    RATING_CHOICES = [(i, f"{i} out of 5") for i in range(1, 6)]

    name = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    location = models.CharField(max_length=100)
    rating = models.IntegerField(choices=RATING_CHOICES)
    feedback = models.TextField()
    image = models.ImageField(upload_to='testimonials/', blank=True, null=True)

    def __str__(self):
        return f"{self.name} - {self.company}"
        
class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.email}"


class FAQ(models.Model):
    question = models.CharField(max_length=255)
    answer = models.TextField()
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0, help_text="Order of display in FAQ section")

    class Meta:
        ordering = ['order']  # Display according to order
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"

    def __str__(self):
        return self.question