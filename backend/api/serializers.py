from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models.barraca_festa import Barraca_Festa
from .models.barraca import Barraca
from .models.caixa_festa import Caixa_Festa
from .models.cartao import Cartao
from .models.cliente import Cliente
from .models.estoque import Estoque
from .models.festa import Festa
from .models.movimentacao_barraca import Movimentacao_Barraca
from .models.movimentacao_caixa import Movimentacao_Caixa
from .models.produto import Produto
from .models.produto_festa import Produto_Festa
from .models.tipo_produto import Tipo_produto
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    groups = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all(), many=True)
    group_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email', 'first_name', 'last_name', 'is_active', 'is_staff', 'groups', 'group_name')

    def get_group_name(self, obj):
        return [group.name for group in obj.groups.all()]

    def create(self, validated_data):
        password = validated_data.pop('password')
        groups = validated_data.pop('groups', [])
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        if groups:
            user.groups.set(groups)
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        groups = validated_data.pop('groups', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        if groups is not None:
            instance.groups.set(groups)

        instance.save()
        return instance
    

class UserProfileSerializer(serializers.ModelSerializer):
    groups = serializers.PrimaryKeyRelatedField(
        queryset=Group.objects.all(),
        many=True 
    )
    group_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'first_name', 'username', 'groups', 'group_name', 'is_active']  

    def get_group_name(self, obj):
        return [group.name for group in obj.groups.all()] 


class Barraca_FestaSerializer(serializers.ModelSerializer):
    user_responsavel_username = serializers.SerializerMethodField()
    barraca_nome = serializers.SerializerMethodField()

    class Meta:
        model = Barraca_Festa
        fields = ["id", "barraca", "barraca_nome", "festa", "user_responsavel", "user_responsavel_username"]

    def get_user_responsavel_username(self, obj):
        return obj.user_responsavel.username

    def get_barraca_nome(self, obj):
        return obj.barraca.nome

    def validate(self, data):
        festa_atual = Festa.objects.filter(fechada=False).order_by('-data_inicio').first()
        if festa_atual:
            user_responsavel = data.get('user_responsavel')
            if Barraca_Festa.objects.filter(festa=festa_atual, user_responsavel=user_responsavel).exists():
                raise serializers.ValidationError({"message": ["Este usuário já está associado a uma barraca na festa atual."]})
        else:
            raise serializers.ValidationError({"message": ["Nenhuma festa atual disponível para associar."]})
        return data
    
class BarracaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Barraca
        fields = ["id", "nome", "ativo", "dataCriacao"]  


class Caixa_FestaSerializer(serializers.ModelSerializer):
    user_caixa_username = serializers.SerializerMethodField()

    class Meta:
        model = Caixa_Festa
        fields = ["id", "festa", "user_caixa", "user_caixa_username"]

    def get_user_caixa_username(self, obj):
        if isinstance(obj, Caixa_Festa):
            return obj.user_caixa.username
        return None

    def validate(self, data):
        festa_atual = Festa.objects.filter(fechada=False).order_by('-data_inicio').first()
        if festa_atual:
            user_caixa = data.get('user_caixa')
            if Caixa_Festa.objects.filter(festa=festa_atual, user_caixa=user_caixa).exists():
                raise serializers.ValidationError({"message": "Este caixa já está associado à festa atual."})
        else:
            raise serializers.ValidationError({"message": "Nenhuma festa atual disponível para associar."})
        return data
        

class CartaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cartao
        fields = ["id", "cliente", "ativo"]      


class ClienteSerializer(serializers.ModelSerializer):
    data_nascimento_formatada = serializers.SerializerMethodField()

    class Meta:
        model = Cliente
        fields = ["id", "nome", "data_nascimento", "data_nascimento_formatada", "cpf", "ativo"]  

    def get_data_nascimento_formatada(self, obj):
        # Acessa a data_nascimento do objeto e formata
        if obj.data_nascimento:
            return obj.data_nascimento.strftime('%d/%m/%Y')
        return None   


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


class Produto_FestaSerializer(serializers.ModelSerializer):
    produto_nome = serializers.CharField(source='produto.nome', read_only=True)
    class Meta:
        model = Produto_Festa
        fields = [ 'id', 'produto', 'produto_nome', 'festa', 'valor']        


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