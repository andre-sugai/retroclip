import React from 'react';
import { X } from 'lucide-react';

interface TermsModalProps {
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4 max-h-[85vh] overflow-hidden">
        {/* Modal Card */}
        <div className="bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-3xl shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 bg-zinc-900/95 backdrop-blur-xl border-b border-zinc-800 p-6 rounded-t-3xl">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
              aria-label="Fechar"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-black tracking-tighter uppercase leading-none">
              Grooovio
            </h2>
            <p className="text-sm text-zinc-400 mt-1">Termos e Condições de Uso</p>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)] space-y-6 text-zinc-300">
            <section>
              <h3 className="text-lg font-bold text-white mb-2">1. Aceitação dos Termos</h3>
              <p className="text-sm leading-relaxed">
                Ao criar uma conta e utilizar o Grooovio (Music Video Time Machine), você concorda 
                com estes Termos e Condições. Se você não concorda com qualquer parte destes termos, 
                não utilize nossos serviços.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-white mb-2">2. Descrição do Serviço</h3>
              <p className="text-sm leading-relaxed">
                O Grooovio é uma plataforma de streaming de videoclipes que permite aos usuários 
                explorar e assistir clipes musicais de diferentes épocas, décadas e gêneros musicais. 
                Todo o conteúdo é fornecido através de embeddings do YouTube e está sujeito aos 
                termos de serviço da plataforma original.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-white mb-2">3. Conta de Usuário</h3>
              <ul className="list-disc list-inside text-sm space-y-2 leading-relaxed">
                <li>Você é responsável por manter a confidencialidade da sua senha</li>
                <li>Você deve ter pelo menos 13 anos para criar uma conta</li>
                <li>Uma pessoa pode ter apenas uma conta ativa</li>
                <li>Você é responsável por todas as atividades realizadas em sua conta</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-white mb-2">4. Privacidade e Dados</h3>
              <p className="text-sm leading-relaxed mb-2">
                Coletamos e armazenamos as seguintes informações:
              </p>
              <ul className="list-disc list-inside text-sm space-y-2 leading-relaxed">
                <li>Email (para autenticação e comunicação)</li>
                <li>Nome de usuário e nome completo (perfil público)</li>
                <li>Histórico de visualizações (para recomendações personalizadas)</li>
                <li>Artistas e décadas favoritas (preferências do usuário)</li>
              </ul>
              <p className="text-sm leading-relaxed mt-2">
                Seus dados são armazenados de forma segura através do Supabase e nunca serão 
                compartilhados com terceiros sem seu consentimento explícito.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-white mb-2">5. Uso Aceitável</h3>
              <p className="text-sm leading-relaxed mb-2">Você concorda em NÃO:</p>
              <ul className="list-disc list-inside text-sm space-y-2 leading-relaxed">
                <li>Usar o serviço para qualquer finalidade ilegal</li>
                <li>Tentar acessar contas de outros usuários</li>
                <li>Fazer engenharia reversa ou modificar o código do site</li>
                <li>Usar bots ou automação para manipular o sistema</li>
                <li>Fazer scraping ou download em massa de conteúdo</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-white mb-2">6. Propriedade Intelectual</h3>
              <p className="text-sm leading-relaxed">
                Todos os videoclipes são propriedade de seus respectivos detentores de direitos 
                autorais. O Grooovio atua apenas como agregador, fornecendo links para conteúdo 
                hospedado no YouTube. A interface, logo, e código do Grooovio são propriedade 
                exclusiva do projeto.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-white mb-2">7. Modificações</h3>
              <p className="text-sm leading-relaxed">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                Alterações significativas serão notificadas por email. O uso continuado 
                do serviço após modificações constitui aceitação dos novos termos.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-white mb-2">8. Cancelamento</h3>
              <p className="text-sm leading-relaxed">
                Você pode cancelar sua conta a qualquer momento através do painel de configurações. 
                Podemos suspender ou encerrar contas que violem estes termos sem aviso prévio.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-white mb-2">9. Isenção de Garantias</h3>
              <p className="text-sm leading-relaxed">
                O Grooovio é fornecido "como está", sem garantias de qualquer tipo. Não garantimos 
                que o serviço será ininterrupto, seguro ou livre de erros.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-white mb-2">10. Contato</h3>
              <p className="text-sm leading-relaxed">
                Para questões sobre estes termos, entre em contato através do painel de informações 
                do aplicativo.
              </p>
            </section>

            <div className="pt-4 border-t border-zinc-800 text-center">
              <p className="text-xs text-zinc-500 font-mono">
                Última atualização: 11 de fevereiro de 2026<br />
                Grooovio V 1.25.3 // ARIA-COMPLIANT
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-800 p-4 rounded-b-3xl">
            <button
              onClick={onClose}
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:shadow-[0_0_25px_rgba(245,158,11,0.6)]"
            >
              Entendi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
