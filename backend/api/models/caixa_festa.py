from django.db import models
from django.contrib.auth.models import User
from .festa import Festa


class Caixa_Festa(models.Model):
    festa = models.ForeignKey(Festa, on_delete=models.RESTRICT, related_name="caixas_festa")
    troco_inicial = models.DecimalField(max_digits=10, decimal_places=2)
    troco_final = models.DecimalField(max_digits=10, decimal_places=2)
    iniciado = models.BooleanField(default=False)
    finalizado  = models.BooleanField(default=False)
    user_caixa = models.ForeignKey(User, on_delete=models.RESTRICT, related_name="festas")

    def __str__(self):
        return self.user_caixa
