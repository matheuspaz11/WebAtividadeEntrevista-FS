using FI.AtividadeEntrevista.BLL;

namespace WebAtividadeEntrevista.Helpers.Validators
{
    public sealed class ValidateCPF
    {
        public static bool AlreadyExists(string cpf)
        {
            BoCliente bo = new BoCliente();

            return bo.VerificarExistencia(cpf);
        }
    }
}