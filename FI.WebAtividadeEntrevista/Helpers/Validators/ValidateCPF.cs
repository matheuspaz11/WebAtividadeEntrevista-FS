using FI.AtividadeEntrevista.BLL;
using WebAtividadeEntrevista.Models;

namespace WebAtividadeEntrevista.Helpers.Validators
{
    public sealed class ValidateCPF
    {
        public static bool AlreadyExistsCliente(ClienteModel model)
        {
            BoCliente bo = new BoCliente();

            return bo.VerificarExistencia(model.CPF, model.Id);
        }

        public static bool AlreadyExistsBeneficiario(BeneficiarioModel model)
        {
            BoBeneficiario bo = new BoBeneficiario();

            return bo.VerificarExistencia(model.CPF, model.Id);
        }
    }
}