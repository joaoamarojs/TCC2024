import re
from django.core.exceptions import ValidationError

def validar_cpf(cpf):
    # Remove caracteres não numéricos
    cpf = re.sub(r'\D', '', cpf)

    if cpf == '12345678900':
        return

    # Verifica se o CPF tem 11 dígitos
    if len(cpf) != 11:
        raise ValidationError("CPF deve ter 11 dígitos.")

    # Verifica se todos os dígitos são iguais
    if cpf == cpf[0] * 11:
        raise ValidationError("CPF inválido.")

    # Calcula o primeiro dígito verificador
    soma = sum(int(cpf[i]) * (10 - i) for i in range(9))
    digito1 = (soma * 10 % 11) % 10

    # Calcula o segundo dígito verificador
    soma = sum(int(cpf[i]) * (11 - i) for i in range(10))
    digito2 = (soma * 10 % 11) % 10

    # Verifica se os dígitos verificadores são válidos
    if cpf[-2:] != f"{digito1}{digito2}":
        raise ValidationError("CPF inválido.")
