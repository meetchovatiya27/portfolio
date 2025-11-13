from django.urls import path
from . import views
from .views import experience_list


urlpatterns = [
    path('', views.index, name='index'),
    path('hero-data/', views.hero_data, name='hero-data'),
    path('about/', views.about_data, name='about-data'),
    path("projects/", views.projects_list, name="projects-list"),
    path('experiences/', experience_list, name='experience-list'),
    path("contact/", views.contact_submit, name="contact-submit"),
    path("testimonials/", views.testimonials_view, name="testimonials"),
    path("testimonials-list/", views.testimonials_list, name="testimonials-list"),
    path("faq-list/", views.faq_list, name="faq-list"),
]
