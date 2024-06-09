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
    }
}