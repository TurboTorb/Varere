export async function get({ params, url}) {
    const response = await fetch(url.origin+'/api/projects.json');
    const { projects } = await response.json();
    const project = projects.find((proj) => proj.id == params.id);
    if (project) {
        return {
            status: 200,
            body: { project }
        }
    }
    return {
        status: 404
    }
}