import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LegalPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans py-20 px-6">
            <div className="container mx-auto max-w-3xl">
                <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-8 transition-colors">
                    <ArrowLeft size={20} className="mr-2" />
                    Voltar para a Home
                </Link>

                <h1 className="text-4xl font-bold mb-12 text-slate-900">Termos de Uso e Privacidade</h1>

                <div className="prose prose-slate max-w-none">
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold mb-4 text-slate-800">1. Termos de Uso</h2>
                        <p className="mb-4 text-slate-600">
                            Bem-vindo ao BarberSaaS. Ao acessar e usar nossa plataforma, você concorda com estes termos.
                            Nossa plataforma fornece ferramentas para criação e gerenciamento de sites para barbearias.
                        </p>
                        <h3 className="text-xl font-semibold mb-2 text-slate-800">Uso Aceitável</h3>
                        <p className="mb-4 text-slate-600">
                            Você concorda em usar o serviço apenas para fins legais e de acordo com estes termos.
                            Não é permitido usar a plataforma para distribuir conteúdo ilegal, ofensivo ou que viole direitos de terceiros.
                        </p>
                        <h3 className="text-xl font-semibold mb-2 text-slate-800">Contas e Assinaturas</h3>
                        <p className="mb-4 text-slate-600">
                            Para acessar certos recursos, você precisará criar uma conta. Você é responsável por manter a confidencialidade de sua senha.
                            As assinaturas são cobradas mensalmente e podem ser canceladas a qualquer momento.
                        </p>
                    </section>

                    <hr className="border-slate-200 my-12" />

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold mb-4 text-slate-800">2. Política de Privacidade</h2>
                        <p className="mb-4 text-slate-600">
                            Sua privacidade é importante para nós. Esta política descreve como coletamos, usamos e protegemos suas informações.
                        </p>
                        <h3 className="text-xl font-semibold mb-2 text-slate-800">Coleta de Dados</h3>
                        <p className="mb-4 text-slate-600">
                            Coletamos informações que você nos fornece diretamente, como nome, email e dados da barbearia.
                            Também coletamos dados de uso automaticamente para melhorar nosso serviço.
                        </p>
                        <h3 className="text-xl font-semibold mb-2 text-slate-800">Uso das Informações</h3>
                        <p className="mb-4 text-slate-600">
                            Usamos seus dados para fornecer e melhorar o serviço, processar pagamentos e nos comunicar com você.
                            Não vendemos seus dados pessoais para terceiros.
                        </p>
                        <h3 className="text-xl font-semibold mb-2 text-slate-800">Segurança</h3>
                        <p className="mb-4 text-slate-600">
                            Implementamos medidas de segurança para proteger seus dados contra acesso não autorizado, alteração ou destruição.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-slate-800">Contato</h2>
                        <p className="text-slate-600">
                            Se você tiver dúvidas sobre estes termos ou nossa política de privacidade, entre em contato conosco através do email: suporte@barbersaas.com.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
