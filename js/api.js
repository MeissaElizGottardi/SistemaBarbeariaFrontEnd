const BASE_URL = "https://sua-api-render.com";

export async function getDados(endpoint) {
    const response = await fetch(`${BASE_URL}/${endpoint}`);
    return response.json();
}

export async function postDados(endpoint, dados) {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    });
    return response.json();
}

export async function putDados(endpoint, dados) {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    });
    return response.json();
}

export async function deleteDados(endpoint) {
    await fetch(`${BASE_URL}/${endpoint}`, {
        method: "DELETE"
    });
}