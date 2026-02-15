# 📧 Email Templates - Grooovio

Templates de email personalizados para autenticação Supabase.

## 📝 Como Aplicar os Templates

### 1. Acessar o Dashboard do Supabase

Faça login em: https://supabase.com/dashboard/project/enyevbcvignhhgccufxu

### 2. Navegar para Email Templates

1. No menu lateral, clique em **Authentication** (🔐)
2. Clique na aba **Email Templates**
3. Você verá uma lista de templates disponíveis

### 3. Configurar o Template de Confirmação

1. Selecione **"Confirm signup"** na lista
2. Cole o conteúdo do arquivo `confirm-signup.html` no editor
3. Preencha os campos:
   - **Subject**: `✓ Confirme sua conta no Grooovio`
   - **Body (HTML)**: Cole todo o conteúdo do `confirm-signup.html`

### 4. Variáveis Disponíveis

O Supabase substitui automaticamente estas variáveis:

- `{{ .Email }}` - Email do usuário
- `{{ .ConfirmationURL }}` - URL de confirmação única
- `{{ .Token }}` - Token de confirmação (se necessário)
- `{{ .SiteURL }}` - URL do site configurado

### 5. Testar o Template

Após salvar:

1. Crie uma conta de teste no app
2. Verifique o email recebido
3. Confirme que:
   - ✅ Aparece em português
   - ✅ Logo Grooovio está visível
   - ✅ Botão de confirmação funciona
   - ✅ Design está responsivo no mobile

## 🎨 Personalizações

### Cores do Grooovio

- **Background**: `#09090B` (zinc-950)
- **Cards**: `#18181B` (zinc-900)
- **Borders**: `#27272A` (zinc-800)
- **Accent**: `#F59E0B` (amber-500)
- **Text**: `#D4D4D8` (zinc-300)
- **Muted**: `#71717A` (zinc-500)

### Fontes

- **Primary**: System fonts (-apple-system, Segoe UI, Roboto)
- **Monospace**: Para códigos e versões

## 📱 Compatibilidade

O template foi testado em:

- ✅ Gmail (Desktop e Mobile)
- ✅ Outlook (Web e Desktop)
- ✅ Apple Mail (macOS e iOS)
- ✅ Yahoo Mail
- ✅ ProtonMail

## 🚨 Troubleshooting

### Email não está chegando?

1. Verifique se o template foi salvo corretamente
2. Confirme que o SMTP está configurado (Supabase usa SendGrid por padrão)
3. Verifique spam/lixeira
4. Teste com outro endereço de email

### Template não aparece formatado?

- Alguns clientes bloqueiam CSS inline
- O template foi projetado para funcionar mesmo sem CSS
- Use ferramentas como [Litmus](https://litmus.com) para testar

## 📚 Próximos Templates

Outros templates que podem ser personalizados:

- **Magic Link** - Login sem senha
- **Invite User** - Convites de equipe  
- **Reset Password** - Recuperação de senha
- **Change Email** - Confirmação de novo email

---

**Status**: ✅ Template de confirmação pronto para uso  
**Última atualização**: 11 de fevereiro de 2026
