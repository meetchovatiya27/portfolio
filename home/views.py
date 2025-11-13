from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_http_methods
from .models import HeroSection
from .models import About
from .models import Skill
from .models import Project
from .models import Experience
from .models import ContactMessage
from .models import Testimonial
from .models import FAQ
import json

def index(request):
    hero = HeroSection.objects.first()
    if hero:
        data = {
            "name": hero.name,
            "role": hero.role,
            "tagline": hero.tagline,
            "resume_link": hero.resume_file.url,
        }
    else:
        data = {
            "name": "",
            "role": "",
            "tagline": "",
            "resume_link": "",
        }

    return render(request, "index.html", {"hero_data": data})


@csrf_exempt
@require_http_methods(["GET", "POST"])
def hero_data(request):
    # Fetch the first hero object or create if none
    hero, created = HeroSection.objects.get_or_create(id=1)

    if request.method == "POST":
        try:
            data = json.loads(request.body)

            # Update basic info
            hero.name = data.get("name", hero.name)
            hero.role = data.get("role", hero.role)
            hero.tagline = data.get("tagline", hero.tagline)
            hero.location = data.get("location", hero.location)
            hero.available_for_work = data.get("available_for_work", hero.available_for_work)

            # Update social links (optional: URLs)
            if "linkedin_url" in data:
                hero.linkedin_url = data["linkedin_url"]
            if "github_url" in data:
                hero.github_url = data["github_url"]
            if "instagram_url" in data:
                hero.instagram_url = data["instagram_url"]

            # File uploads via URL are tricky; normally you'd handle via multipart/form-data
            hero.save()

            return JsonResponse({"success": True, "message": "Hero section updated successfully"})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=400)

    # GET request returns the data
    return JsonResponse({
        "name": hero.name,
        "role": hero.role,
        "tagline": hero.tagline,
        "resume_link": request.build_absolute_uri(hero.resume_file.url) if hero.resume_file else "",
        "linkedin_icon": request.build_absolute_uri(hero.linkedin_icon.url) if hero.linkedin_icon else "",
        "github_icon": request.build_absolute_uri(hero.github_icon.url) if hero.github_icon else "",
        "instagram_icon": request.build_absolute_uri(hero.instagram_icon.url) if hero.instagram_icon else "",
        "linkedin_url": hero.linkedin_url or "",
        "github_url": hero.github_url or "",
        "instagram_url": hero.instagram_url or "",
        "location": hero.location or "Rajkot",
        "available_for_work": hero.available_for_work,
    })

def about_data(request):
    about = About.objects.first()
    if not about:
        return JsonResponse({"error": "No About data found"}, status=404)

    skills = [{"name": skill.name, "icon": skill.icon.url} for skill in about.skills.all()]

    data = {
        "name": about.name,
        "profile_image": about.profile_image.url if about.profile_image else "",
        "education": about.education,
        "about_text": about.about_text,
        "skills": skills,
    }
    return JsonResponse(data)

def projects_list(request):
    projects = Project.objects.all()
    data = []
    for project in projects:
        data.append({
            "title": project.title,
            "description": project.description,
            "image": project.image.url if project.image else "",
            "github": project.github,
            "demo": project.demo,
            "badges": project.badges,
        })
    return JsonResponse(data, safe=False)

def experience_list(request):
    experiences = Experience.objects.all().order_by('-id')
    data = []

    for exp in experiences:
        data.append({
            "company_name": exp.company_name,
            "position": exp.position,
            "year": exp.year,
            "languages": exp.languages,
            "duration": exp.duration,
            "description": exp.description,
        })
    
    return JsonResponse(data, safe=False)

def testimonials_view(request):
    # Get all testimonials from the database
    testimonials = Testimonial.objects.all()
    
    # Pass them to the template
    return render(request, "testimonials.html", {"testimonials": testimonials})

def testimonials_list(request):
    # JSON API endpoint for testimonials
    testimonials = Testimonial.objects.all().order_by('-id')
    data = []
    
    for testimonial in testimonials:
        data.append({
            "id": testimonial.id,
            "name": testimonial.name,
            "title": testimonial.title,
            "company": testimonial.company,
            "location": testimonial.location,
            "rating": testimonial.rating,
            "feedback": testimonial.feedback,
            "image": request.build_absolute_uri(testimonial.image.url) if testimonial.image else "",
        })
    
    return JsonResponse(data, safe=False)

@csrf_exempt
def contact_submit(request):
    if request.method == "POST":
        import json
        try:
            data = json.loads(request.body)
            name = data.get("name", "").strip()
            email = data.get("email", "").strip()
            message = data.get("message", "").strip()

            if not name or not email or not message:
                return JsonResponse({"success": False, "error": "All fields are required."}, status=400)

            # Validate email format
            from django.core.validators import validate_email
            from django.core.exceptions import ValidationError
            try:
                validate_email(email)
            except ValidationError:
                return JsonResponse({"success": False, "error": "Please enter a valid email address."}, status=400)

            # Save message to database
            ContactMessage.objects.create(name=name, email=email, message=message)

            return JsonResponse({"success": True, "message": "Your message has been sent successfully!"})
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "error": "Invalid data format."}, status=400)
        except Exception as e:
            return JsonResponse({"success": False, "error": "An error occurred. Please try again."}, status=500)

    return JsonResponse({"success": False, "error": "Invalid request method."}, status=405)

def faq_list(request):
    faqs = FAQ.objects.all().order_by('id')
    data = [{"id": faq.id, "question": faq.question, "answer": faq.answer} for faq in faqs]
    return JsonResponse(data, safe=False)