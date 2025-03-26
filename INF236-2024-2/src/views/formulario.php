<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generación de Boletines</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        /* Contenedor principal que agrupa header, caja y footer */
        .main-wrapper {
            width: 90%;
            max-width: 800px;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        /* Header alineado con la caja */
        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0px 0;
        }

        .header-title {
            display: flex;
            flex-direction: column;
            gap: 5px;
            color: #2c3e50;
        }

        .header-title h1 {
            font-size: 1.8em;
            font-weight: 600;
            margin: 0;
        }

        .header-title h2 {
            font-size: 1.2em;
            font-weight: 500;
            color: #546e7a;
            margin: 0;
        }

        .logos-container {
            display: flex;
            gap: 20px;
            align-items: center;
        }

        .logo-space {
            width: 150px;
            height: 130px;
        }

        /* Caja principal */
        .container {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        /* Estilos del formulario */
        .form-container {
            width: 100%;
        }

        h2 {
            color: #2c3e50;
            font-size: 1.4em;
            text-align: center;
            margin-bottom: 30px;
        }

        form label {
            display: block;
            margin: 15px 0 8px;
            color: #2c3e50;
            font-weight: 500;
        }

        form input, 
        form select, 
        form textarea {
            width: 100%;
            padding: 12px;
            margin-bottom: 20px;
            border-radius: 8px;
            border: 1px solid #ddd;
            font-family: inherit;
            font-size: 1em;
            transition: border-color 0.3s ease;
        }

        form input:focus, 
        form select:focus, 
        form textarea:focus {
            outline: none;
            border-color: #2c3e50;
        }

        form textarea {
            min-height: 120px;
            resize: vertical;
        }

        form input[type="submit"] {
            background: linear-gradient(145deg, #34495e, #2c3e50);
            color: white;
            font-weight: 600;
            cursor: pointer;
            padding: 15px;
            margin-top: 20px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(52, 73, 94, 0.2);
        }

        form input[type="submit"]:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(52, 73, 94, 0.3);
        }

        .hidden {
            display: none;
        }

        /* Footer version */
        .version-footer {
            text-align: center;
            color: #2c3e50;
            font-size: 0.9em;
            padding: 10px 0;
        }

        .version-footer span {
            color: #e74c3c;
        }

    
        /* Añade estos estilos específicos para las etiquetas */
        .tags-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 8px;
            min-height: 45px;
            margin-bottom: 20px;
        }

        .tag {
            background-color: rgba(52, 152, 219, 0.2);
            border-radius: 16px;
            padding: 5px 10px;
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 1em;
        }

        .tag-close {
            cursor: pointer;
            color: #2c3e50;
            font-weight: bold;
        }

        .tags-input {
            border: none;
            outline: none;
            flex-grow: 1;
            min-width: 100px;
            padding: 5px;
        }

        .tags-input:focus {
            outline: none;
        }

        /* nav footer menu principal */ 

        .nav-footer {
        text-align: center;
        margin-top: 20px;
        }

        .return-button {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            color: #2c3e50;
            text-decoration: none;
            font-size: 0.9em;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }

        .return-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
        }

        .return-button span {
            color: #e74c3c;
        }

        .return-button:active {
            transform: translateY(0);
        }

        @media (max-width: 600px) {
            .main-wrapper {
                width: 95%;
            }

            .header-title h1 {
                font-size: 1.4em;
            }

            .logo-space {
                width: 100px;
                height: 90px;
            }

            .container {
                padding: 20px;
            }

            form input[type="submit"] {
                padding: 12px;
            }
        }
    </style>
</head>
<body>
    <div class="main-wrapper">

        <!-- Contenedor principal -->
        <div class="container">
            
            <h2>Nuevo Boletin</h2>
            
            <div class="form-container">
                <form action="guardar-boletin.php" method="POST" onsubmit="validarFormulario(event)">
                    <!-- Título -->
                    <label for="titulo">Título</label>
                    <input type="text" id="titulo" name="titulo" placeholder="Ingrese el título del boletín" required>
            
                    <!-- Sistema de etiquetas -->
                    <label for="temas">Temas de Interés</label>
                    <div class="tags-container" id="tagsContainer">
                        <input type="text" class="tags-input" id="tagsInput" placeholder="Escriba un tema y presione Enter">
                        <input type="hidden" id="temasHidden" name="temas" value="">
                    </div>
            
                    <!-- Span de búsqueda -->
                    <label for="span">Periodo de Búsqueda</label>
                    <select id="span" name="span" required>
                        <option value="">Ingrese tiempo</option>
                        <option value="1_mes">1 mes</option>
                        <option value="3_meses">3 meses</option>
                        <option value="6_meses">6 meses</option>
                        <option value="1_año">1 año</option>
                        <option value="2_años">2 años</option>
                        <option value="3_años">3 años</option>
                        <option value="4_años">4 años</option>
                        <option value="5_años">5 años</option>
                        <option value="10_años">10 años</option>
                    </select>
            
                    <!-- Indicaciones extra -->
                    <label for="indicaciones">Indicaciones Extra</label>
                    <textarea id="indicaciones" name="indicaciones" 
                              placeholder="Ingrese cualquier indicación adicional para la búsqueda" 
                              rows="4"></textarea>
            
                    <input type="submit" value="Generar Boletín">
                </form>
            </div>
        </div>

        <!-- Footer con versión -->
        <div class="nav-footer">
            <a href="index.html" class="return-button">
                Volver al Menú Principal 
            </a>
        </div>
    </div>

    <script>
        // Sistema de manejo de etiquetas
        document.addEventListener('DOMContentLoaded', function() {
            const tagsContainer = document.getElementById('tagsContainer');
            const tagsInput = document.getElementById('tagsInput');
            const temasHidden = document.getElementById('temasHidden');
            let tags = [];
    
            function actualizarTags() {
                temasHidden.value = JSON.stringify(tags);
            }
    
            function agregarTag(texto) {
                if (texto && !tags.includes(texto)) {
                    tags.push(texto);
                    const tagElement = document.createElement('div');
                    tagElement.className = 'tag';
                    tagElement.innerHTML = `
                        ${texto}
                        <span class="tag-close" onclick="this.parentElement.remove(); 
                        tags = tags.filter(t => t !== '${texto}'); actualizarTags();">×</span>
                    `;
                    tagsContainer.insertBefore(tagElement, tagsInput);
                    actualizarTags();
                }
            }
    
            tagsInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    const texto = this.value.trim();
                    if (texto) {
                        agregarTag(texto);
                        this.value = '';
                    }
                }
            });
    
            // Validación del formulario actualizada
            window.validarFormulario = function(event) {
                const titulo = document.getElementById('titulo').value.trim();
                const indicaciones = document.getElementById('indicaciones').value.trim();
                
                if (!titulo) {
                    alert("El título es obligatorio.");
                    event.preventDefault();
                    return;
                }
    
                if (tags.length === 0) {
                    alert("Debe ingresar al menos un tema de interés.");
                    event.preventDefault();
                    return;
                }
    
                if (!indicaciones) {
                    alert("Las indicaciones son obligatorias.");
                    event.preventDefault();
                    return;
                }
            }
        });
    </script>

    <script>
        function mostrarCampoTema() {
            const temaSelect = document.getElementById("tema");
            const campoOtroTema = document.getElementById("otroTemaContainer");
            if (temaSelect.value === "otro") {
                campoOtroTema.classList.remove("hidden");
            } else {
                campoOtroTema.classList.add("hidden");
                document.getElementById("otroTema").value = "";
            }
        }

        function validarFormulario(event) {
            const descripcion = document.getElementById("descripcion").value.trim();
            if (!descripcion) {
                alert("La descripción es obligatoria.");
                event.preventDefault();
            }
        }
    </script>
</body>
</html>