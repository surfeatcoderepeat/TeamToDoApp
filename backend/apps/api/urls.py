from django.urls import path
from .views import TaskList, TaskDetail, ProjectList, ProjectDetail, ShareProject, JoinProject, ManageParticipants

urlpatterns = [
    path('projects/', ProjectList.as_view(), name='project-list'),
    path('projects/<int:project_pk>/', ProjectDetail.as_view(), name='project-detail'),
    path('projects/<int:project_pk>/share/', ShareProject.as_view(), name='share-project'),
    path('join-project/<uuid:token>/', JoinProject.as_view(), name='join-project'),
    path('projects/<int:project_pk>/participants/', ManageParticipants.as_view(), name='manage-participants'),
    path('projects/<int:project_pk>/tasks/', TaskList.as_view(), name='task-list'),
    path('projects/<int:project_pk>/tasks/<int:task_pk>/', TaskDetail.as_view(), name='task-detail'),
]