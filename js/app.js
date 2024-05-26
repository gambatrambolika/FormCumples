document.addEventListener("DOMContentLoaded", function() {
    const alumnoForm = document.getElementById('alumnoForm');
    const listaAlumnos = document.getElementById('tablaAlumnos').getElementsByTagName('tbody')[0];
    const alumnoChartCtx = document.getElementById('graficoAlumnos').getContext('2d');
    let alumnos = [];
    let chart = new Chart(alumnoChartCtx, {
        type: 'pie',
        data: {
            labels: ['Femenino', 'Masculino'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#FF6384', '#36A2EB']
            }]
        },
        options: {
            responsive: true
        }
    });

    alumnoForm.addEventListener('submit', function(event) {
        event.preventDefault();
        let nombre = document.getElementById('nombre').value;
        let genero = document.querySelector('input[name="genero"]:checked').value;
        let dia = parseInt(document.getElementById('dia').value);
        let mes = parseInt(document.getElementById('mes').value);
        let ano = parseInt(document.getElementById('anio').value);
        
        let fechaNacimiento = moment(`${ano}-${mes}-${dia}`, 'YYYY-MM-DD');
        
        if (!fechaNacimiento.isValid()) {
            alert('La fecha introducida no es correcta');
            return;
        }
        
        let alumnoNuevo = {
            nombre: nombre,
            genero: genero,
            nacimiento: fechaNacimiento
        };
        
        alumnos.push(alumnoNuevo);
        actualizarListaAlumnos();
        actualizarGrafico();
    });

    function actualizarListaAlumnos() {
        listaAlumnos.innerHTML = '';
        let hoy = moment();
        alumnos.sort((a, b) => {
            let proxCumpleA = moment(a.nacimiento).year(hoy.year());
            if (proxCumpleA.isBefore(hoy)) proxCumpleA.add(1, 'years');
            let proxCumpleB = moment(b.nacimiento).year(hoy.year());
            if (proxCumpleB.isBefore(hoy)) proxCumpleB.add(1, 'years');
            return proxCumpleA.diff(hoy) - proxCumpleB.diff(hoy);
        });
        alumnos.forEach(alumno => {
            let row = listaAlumnos.insertRow();
            let cellNombre = row.insertCell(0);
            let cellEdad = row.insertCell(1);
            let cellDias = row.insertCell(2);
            cellNombre.textContent = alumno.nombre;
            cellEdad.textContent = moment().diff(alumno.nacimiento, 'years') + " años";
            let proxCumple = moment(alumno.nacimiento).year(hoy.year());
            if (proxCumple.isBefore(hoy)) proxCumple.add(1, 'years');
            cellDias.textContent = proxCumple.diff(hoy, 'days') + " días";
        });
    }

    function actualizarGrafico() {
        let femenino = alumnos.filter(alumno => alumno.genero === 'Femenino').length;
        let masculino = alumnos.filter(alumno => alumno.genero === 'Masculino').length;
        chart.data.datasets[0].data[0] = femenino;
        chart.data.datasets[0].data[1] = masculino;
        chart.update();
    }
});
