from django.db import models
from django.contrib.auth.models import User
from .festa import Festa
from .barraca import Barraca


class Barraca_Festa(models.Model):
    barraca = models.ForeignKey(Barraca, on_delete=models.RESTRICT, related_name="festas")
    festa = models.ForeignKey(Festa, on_delete=models.RESTRICT, related_name="barracas")
    user_responsavel = models.ForeignKey(User, on_delete=models.RESTRICT, related_name="barracas")

    def __str__(self):
        return self.barraca
