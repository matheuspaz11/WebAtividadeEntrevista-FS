
$(document).ready(function () {
    $('#CPF').mask('000.000.000-00');
    $('#CEP').mask('00000-000');
    $('#Telefone').mask('(00) 00000-0000');

    if (obj) {
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);
        $('#formCadastro #CPF').val(obj.CPF);
    }

    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        const cpf = $(this).find("#CPF").val();

        if (!isValidCPF(cpf)) {
            ModalDialog("Campo inválido!", "O valor do campo CPF não está no padrão correto, verifique e tente novamente.");
        } else {
            $.ajax({
                url: urlPost,
                method: "POST",
                data: {
                    "NOME": $(this).find("#Nome").val(),
                    "CEP": $(this).find("#CEP").val(),
                    "Email": $(this).find("#Email").val(),
                    "Sobrenome": $(this).find("#Sobrenome").val(),
                    "Nacionalidade": $(this).find("#Nacionalidade").val(),
                    "Estado": $(this).find("#Estado").val(),
                    "Cidade": $(this).find("#Cidade").val(),
                    "Logradouro": $(this).find("#Logradouro").val(),
                    "Telefone": $(this).find("#Telefone").val(),
                    "CPF": $(this).find("#CPF").val()
                },
                error:
                    function (r) {
                        if (r.status == 400)
                            ModalDialog("Ocorreu um erro", r.responseJSON);
                        else if (r.status == 500)
                            ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                    },
                success:
                    function (r) {
                        ModalDialog("Sucesso!", r)
                        $("#formCadastro")[0].reset();
                        window.location.href = urlRetorno;
                    }
            });
        }
    })
    
})

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}

function isValidCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11) {
        return false;
    }

    let allDigitsEqual = true;
    for (let i = 1; i < cpf.length; i++) {
        if (cpf[i] !== cpf[0]) {
            allDigitsEqual = false;
            break;
        }
    }

    if (allDigitsEqual) {
        return false;
    }

    const multiplier1 = [10, 9, 8, 7, 6, 5, 4, 3, 2];
    const multiplier2 = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];

    let tempCPF = cpf.substring(0, 9);
    let sum = 0;

    for (let i = 0; i < 9; i++) {
        sum += parseInt(tempCPF[i]) * multiplier1[i];
    }

    let remainder = sum % 11;
    let digit1 = (remainder < 2) ? 0 : (11 - remainder);

    tempCPF += digit1;
    sum = 0;

    for (let i = 0; i < 10; i++) {
        sum += parseInt(tempCPF[i]) * multiplier2[i];
    }

    remainder = sum % 11;
    let digit2 = (remainder < 2) ? 0 : (11 - remainder);

    return cpf.endsWith(digit1.toString() + digit2.toString());
}