from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models.barraca_festa import Barraca_Festa
from .models.barraca import Barraca
from .models.caixa_festa import Caixa_Festa
from .models.cartao import Cartao
from .models.cliente import Cliente
from .models.colaborador import Colaborador
from .models.estoque import Estoque
from .models.festa import Festa
from .models.movimentacao_barraca import Movimentacao_Barraca
from .models.movimentacao_caixa import Movimentacao_Caixa
from .models.produto import Produto
from .models.tipo_produto import Tipo_produto
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    groups = serializers.PrimaryKeyRelatedField(
        queryset=Group.objects.all(),
        many=True 
    )
    group_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email', 'first_name', 'last_name', 'is_active', 'is_staff', 'groups', 'group_name')

    def get_group_name(self, obj):
        return [group.name for group in obj.groups.all()] 

    def create(self, validated_data):
        password = validated_data.pop('password')
        groups = validated_data.pop('groups', [])

        user = User.objects.create_user(
            username=validated_data['username'],
            password=password,
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            is_active=validated_data.get('is_active', True),
            is_staff=validated_data.get('is_staff', False),
        )

        if groups:
            user.groups.set(groups) 

        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        groups = validated_data.pop('groups', None)

        if password:
            instance.set_password(password)

        if groups is not None:
            instance.groups.set(groups)

        return super().update(instance, validated_data)
    

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_active']  


class Barraca_FestaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Barraca_Festa
        fields = ["id", "barraca", "festa", "user_responsavel"]  


class BarracaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Barraca
        fields = ["id", "nome", "ativo", "dataCriacao"]  


class Caixa_FestaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Caixa_Festa
        fields = ["id", "festa", "user_caixa"]          
        

class CartaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cartao
        fields = ["id", "cliente", "ativo"]      


class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ["id", "nome", "data_nascimento", "cpf", "ativo"]     


class ColaboradorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Colaborador
        fields = ["id", "nome", "data_nascimento", "ativo"]  


class EstoqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estoque
        fields = ["id", "produto", "quant", "data", "festa"]  


class FestaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Festa
        fields = ["id", "nome", "data_inicio", "fechada"]  


class Movimentacao_BarracaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movimentacao_Barraca
        fields = ["id", "desc", "cartao", "festa", "valor", "user_barraca", "barraca"]  


class Movimentacao_CaixaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movimentacao_Caixa
        fields = ["id", "desc", "cartao", "festa", "valor", "user_caixa"]  


class ProdutoSerializer(serializers.ModelSerializer):
    barraca_nome = serializers.CharField(source='barraca.nome', read_only=True)
    tipo_produto_nome = serializers.CharField(source='tipo_produto.nome', read_only=True)

    class Meta:
        model = Produto
        fields = ['id', 'nome', 'barraca', 'barraca_nome', 'tipo_produto', 'tipo_produto_nome', 'dataCriacao', 'estocavel']


class Tipo_produtoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tipo_produto
        fields = ["id", "nome", "dataCriacao"]      


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'name')     

    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def validate(cls, attrs):
        data = super().validate(attrs)
        user = cls.user
        if user:
            data['user'] = user
        return data