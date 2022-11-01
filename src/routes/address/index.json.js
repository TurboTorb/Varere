export async function get() {
    const projects = [
        {id: 1, label: "Project 1"},
        {id: 2, label: "Project 2"},
        {id: 3, label: "Project 3"},
        {id: 4, label: "Project 4"},
        {id: 5, label: "Project 5"}
    ];
    return {
        status: 200,
        body: { projects }
    }
}