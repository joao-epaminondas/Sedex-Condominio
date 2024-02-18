

function displayUserRecords(userRecords) {
    const userResultsDiv = document.getElementById('userResults');

    if (userRecords.length === 0) {
        userResultsDiv.innerHTML = '<p>Nenhum Resultado Encontrado</p>';
    } else {
        const userTable = document.createElement('table');
        userTable.className = 'table table-striped';
        userTable.innerHTML = `
            <thead class='table-dark'>
                <tr>
                    <th>Nº</th>
                    <th>Data Entrada</th>
                    <th>Destinatario</th>
                </tr>
            </thead>
            <tbody>
                ${userRecords.map(user => `
                    <tr>
                        <td>${user.numeroSedex}</td>
                        <td>${user.data_entrada.split('-').reverse().join('/')}</td>
                        <td>${reduzirTextoDestinatario(user.destinatario,16)}</td>
                        <td style="width: 1px;background-color: ${user.retirado === '1' ? '#f44336' : '#198754'};"></td>
                    </tr>
                `).join('')}
            </tbody>
        `;

        userResultsDiv.innerHTML = '';
        userResultsDiv.appendChild(userTable);
    }
}

function a1(){
var searchTerm = $("#morador").val();


const xhr = new XMLHttpRequest();
xhr.open('GET', `../BackEnd/php/app3.php?searchTerm=${searchTerm}`, true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            const userRecords = response.dados; // Access the "dados" property
            displayUserRecords(userRecords);
        } else {
            console.error('Failed to fetch user records.');
        }
    }
};
xhr.send();
}