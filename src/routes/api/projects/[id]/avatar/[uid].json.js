import { writeFileSync, existsSync, mkdirSync } from 'fs';

export async function post({ request, params }) {
    const filename = `${params.uid}.png`;
    const relative = `/data/${params.id}/avatars/`;
    const path = `static${relative}`;
    const data = JSON.parse((await request.body.read()).toString());
    const file = data['image'];
    console.log('Received', relative, filename);
    try {
        if (!existsSync(path)) mkdirSync(path, { recursive: true });
        writeFileSync(path+filename, file, 'base64');
        const src = relative+filename;
        return {
            status: 200,
            body: { src }
        }
    } catch (err) {
        console.error(err);
        return {
            status: 500,
            message: err.message
        }
    }
}