import { SiteClient } from 'datocms-client';

export default async function RequestsHandler(request, response) {

    if (request.method === 'POST') {
        const TOKEN = '7d636043421ad14ac91f99904534ac';
        const client = new SiteClient(TOKEN);
    
        const record = await client.items.create({
            itemType: '968553', // ID do Model de "Communities" criado pelo Dato
            ...request.body,
        })

        response.json({
            dados: 'Dado qualquer',
            registroCriado: record,
        })
        return;
    }

    response.status(404).json({
        message: 'Aqui não amigão!',
    })
}