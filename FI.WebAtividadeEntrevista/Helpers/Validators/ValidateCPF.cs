using FI.AtividadeEntrevista.BLL;

namespace WebAtividadeEntrevista.Helpers.Validators
{
    public sealed class ValidateCPF
    {
        public static bool AlreadyExistsCliente(string cpf)
        {
            BoCliente bo = new BoCliente();

            return bo.VerificarExistencia(cpf);
        }

        public static bool AlreadyExistsBeneficiario(string cpf)
        {
            BoBeneficiario bo = new BoBeneficiario();

            return bo.VerificarExistencia(cpf);
        }
    }
}