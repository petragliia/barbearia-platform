import { DriveStep } from "driver.js";

/**
 * Driver.js Tour Configuration
 * 
 * Defines the steps for the "Dashboard Tour" and "Editor Tour".
 * Uses the IDs we added to the codebase as anchors.
 */

export const dashboardSteps: DriveStep[] = [
    {
        element: '#tour-dashboard-stats',
        popover: {
            title: '📊 Visão Geral',
            description: 'Acompanhe seu faturamento, agendamentos e desempenho em tempo real.',
            side: "bottom",
            align: 'start'
        }
    },
    {
        element: '#tour-dashboard-schedule',
        popover: {
            title: '📅 Agenda Inteligente',
            description: 'Gerencie seus horários, bloqueios e veja os próximos clientes.',
            side: "right",
            align: 'start'
        }
    }
];

export const editorSteps: DriveStep[] = [
    {
        element: '#tour-editor-sidebar',
        popover: {
            title: '🎨 Barra de Ferramentas',
            description: 'Aqui você personaliza cores, temas e edita o conteúdo do seu site.',
            side: "right",
            align: 'start'
        }
    },
    {
        element: '#tour-editor-preview',
        popover: {
            title: '📱 Preview em Tempo Real',
            description: 'Veja como seu site está ficando enquanto edita. Totalmente responsivo!',
            side: "left",
            align: 'start'
        }
    },
    {
        element: '#tour-editor-save',
        popover: {
            title: '🚀 Publicar',
            description: 'Quando terminar, clique aqui para colocar seu site no ar instantaneamente.',
            side: "top",
            align: 'end'
        }
    }
];
