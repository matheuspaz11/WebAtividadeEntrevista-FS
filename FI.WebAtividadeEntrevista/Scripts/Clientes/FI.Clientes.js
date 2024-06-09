let beneficiarios = [];

$(document).ready(function () {

    $('#CPF').mask('000.000.000-00');
    $('#CEP').mask('00000-000');
    $('#Telefone').mask('(00) 00000-0000');
    $('#BeneficiarioCPF').mask('000.000.000-00');

    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        beneficiarios.forEach((beneficiario, index) => {
            $(this).append(`<input type="hidden" name="Beneficiarios[${index}].CPF" value="${beneficiario.cpf}">`);
            $(this).append(`<input type="hidden" name="Beneficiarios[${index}].Nome" value="${beneficiario.nome}">`);
        });

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
                    "CPF": cpf,
                    "Beneficiarios": beneficiarios
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
                    }
            });
        }
    })

    $("#formBeneficiario").on("submit", function (event) {
        event.preventDefault();

        const cpf = $("#BeneficiarioCPF").val();
        const nome = $("#BeneficiarioNome").val();

        if (!isValidCPF(cpf)) {
            ModalDialog("Campo inválido!", "O valor do campo CPF não está no padrão correto, verifique e tente novamente.");
        } else {
            if (!existeBeneficiario(cpf)) {
                const beneficiario = { cpf, nome };
                beneficiarios.push(beneficiario);

                atualizarLista();

                $("#BeneficiarioCPF").val('');
                $("#BeneficiarioNome").val('');
            } else {
                ModalDialog("Campo inválido!", "Já existe um beneficiario cadastrado com o CPF informado.");
            }
        }
    });

    window.editarBeneficiario = function (index) {
        const beneficiario = beneficiarios[index];

        $("#BeneficiarioCPF").val(beneficiario.cpf);
        $("#BeneficiarioNome").val(beneficiario.nome);

        beneficiarios.splice(index, 1);
        atualizarLista();
    };

    window.excluirBeneficiario = function (index) {
        beneficiarios.splice(index, 1);
        atualizarLista();
    };
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

function atualizarLista() {
    const tbody = $("#beneficiariosTable tbody");
    tbody.empty();

    beneficiarios.forEach((beneficiario, index) => {
        const row = `<tr>
                        <td>${beneficiario.cpf}</td>
                        <td>${beneficiario.nome}</td>
                        <td>
                            <button class="btn btn-sm btn-primary" type="button" onclick="editarBeneficiario(${index})">Alterar</button>
                            <button class="btn btn-sm btn-danger" type="button" onclick="excluirBeneficiario(${index})" style="margin-left: 10px">Excluir</button>
                        </td>
                    </tr>`;
        tbody.append(row);
    });
}

function existeBeneficiario(cpf) {
    return beneficiarios.some(beneficiario => beneficiario.cpf === cpf);
}