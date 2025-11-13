from django.contrib import admin
from .models import HeroSection, About, Skill, Project, Experience,ContactMessage,Testimonial,FAQ

@admin.register(HeroSection)
class HeroSectionAdmin(admin.ModelAdmin):
    list_display = ("name", "role", "location", "available_for_work", "name_color")
    search_fields = ("name", "role", "location")
    list_filter = ("available_for_work",)

    fieldsets = (
        ("Basic Info", {
            "fields": ("name", "name_color", "role", "tagline", "resume_file", "location", "available_for_work")
        }),
        ("Social Icons & URLs", {
            "fields": (
                ("linkedin_icon", "linkedin_url"),
                ("github_icon", "github_url"),
                ("instagram_icon", "instagram_url")
            )
        }),
    )

# About Section
@admin.register(About)
class AboutAdmin(admin.ModelAdmin):
    list_display = ("name", "education")
    search_fields = ("name", "education")

# Skill Section
@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ("name", "icon")
    search_fields = ("name",)

# Project Section
@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "github", "demo")
    search_fields = ("title",)
    list_filter = ("title",)

# Experience Section
@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ("company_name", "position", "year", "duration")
    search_fields = ("company_name", "position", "languages")
    list_filter = ("year", "position")

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'rating', 'image')
    search_fields = ('name', 'company', 'title')
    list_filter = ('rating',)

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "created_at", "message_preview")
    search_fields = ("name", "email", "message")
    list_filter = ("created_at",)
    readonly_fields = ("name", "email", "message", "created_at")
    list_per_page = 20
    
    def message_preview(self, obj):
        return obj.message[:50] + "..." if len(obj.message) > 50 else obj.message
    message_preview.short_description = "Message Preview"    


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ("question", "is_active", "order")
    list_filter = ("is_active",)
    search_fields = ("question", "answer")
    ordering = ("order",)