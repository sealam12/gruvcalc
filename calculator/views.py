from django.shortcuts import render

# Create your views here.
def calculator(request):
    return render(request, 'index.html', {})