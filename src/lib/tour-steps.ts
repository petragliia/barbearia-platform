import { DriveStep } from "driver.js";

export const dashboardSteps: DriveStep[] = [
    {
        element: '#tour-dashboard-stats',
        popover: {
            title: 'Visão Geral',
            description: 'Acompanhe o faturamento, agendamentos e novos clientes em tempo real.',
            side: "bottom",
            align: 'start'
        }
    },
    {
        element: '[href="/dashboard/marketing"]', // Assuming this link exists in sidebar
        popover: {
            title: 'Marketing e Fidelidade',
            description: 'Crie campanhas automáticas e configure seu programa de pontos aqui.',
            side: "right",
            align: 'center'
        }
    },
    {
        element: '[href="/dashboard/site"]', // Link to site editor
        popover: {
            title: 'Personalize seu Site',
            description: 'Acesse o editor visual para alterar cores, fotos e textos do seu site.',
            side: "right",
            align: 'center'
        }
    }
];

export const editorSteps: DriveStep[] = [
    {
        element: '#tour-editor-sidebar',
        popover: {
            title: 'Barra de Ferramentas',
            description: 'Aqui você personaliza tudo: cores, tipografia, seções e conteúdo.',
            side: "right",
            align: 'start'
        }
    },
    {
        element: '#tour-editor-preview',
        popover: {
            title: 'Preview em Tempo Real',
            description: 'Veja como seu site está ficando na simulação de celular.',
            side: "left",
            align: 'center'
        }
    },
    {
        element: '#tour-editor-save',
        popover: {
            title: 'Salvar e Publicar',
            description: 'Não esqueça de salvar suas alterações para que elas entrem no ar.',
            side: "top",
            align: 'end'
        }
    }
];
