import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Chip,
  Paper,
  Divider,
  IconButton
} from '@mui/material';
import {
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Info as InfoIcon,
  Event as EventIcon,
  Phone as PhoneIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const DetalheEmpresaModal = ({ open, empresa, onClose }) => {
  if (!empresa) return null;

  const formatarMoeda = (valor) => {
    if (!valor) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (data) => {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarCNPJ = (cnpj) => {
    if (!cnpj) return '-';
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  };

  const formatarTelefone = (ddd, telefone) => {
    if (!ddd || !telefone || telefone === 'nan') return '-';
    return `(${ddd}) ${telefone.replace(/(\d{4})(\d{4})/, "$1-$2")}`;
  };

  const getSituacaoCadastral = (codigo) => {
    const situacoes = {
      '1': 'NULA',
      '2': 'ATIVA',
      '3': 'SUSPENSA',
      '4': 'INAPTA',
      '8': 'BAIXADA',
    };
    return situacoes[codigo] || 'NÃO INFORMADA';
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return '-';
    return string.toLowerCase().split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const InfoSection = ({ icon: Icon, title, children }) => (
    <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Icon color="primary" />
            {title}
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>
        {children}
      </Grid>
    </Paper>
  );

  const InfoItem = ({ label, value, xs = 6 }) => (
    <Grid item xs={12} sm={xs}>
      <Typography variant="caption" color="textSecondary">
        {label}
      </Typography>
      <Typography variant="body1">
        {value || '-'}
      </Typography>
    </Grid>
  );

  const situacaoCadastral = getSituacaoCadastral(empresa.situacao_cadastral);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle sx={{ 
        bgcolor: 'primary.main', 
        color: 'primary.contrastText',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <Typography variant="h6" component="span">
            Detalhes da Empresa
          </Typography>
          <Chip
            label={situacaoCadastral}
            color={situacaoCadastral === 'ATIVA' ? 'success' : 'error'}
            size="small"
            sx={{ ml: 2 }}
          />
        </div>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: 'inherit' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Informações Principais */}
        <InfoSection icon={BusinessIcon} title="Informações Principais">
          <InfoItem 
            label="Razão Social" 
            value={capitalizeFirstLetter(empresa.razao_social_nome_empresarial)}
            xs={12}
          />
          <InfoItem label="CNPJ" value={formatarCNPJ(empresa.cnpj)} />
          <InfoItem label="CNPJ Base" value={empresa.cnpj_base} />
          <InfoItem 
            label="Nome Fantasia" 
            value={capitalizeFirstLetter(empresa.nome_fantasia)}
          />
          <InfoItem 
            label="Tipo" 
            value={empresa.identificador_matriz_filial === '1' ? 'Matriz' : 'Filial'} 
          />
          <InfoItem 
            label="Porte" 
            value={capitalizeFirstLetter(empresa.porte_empresa)} 
          />
          <InfoItem 
            label="Capital Social" 
            value={formatarMoeda(empresa.capital_social)} 
          />
          <InfoItem 
            label="Natureza Jurídica" 
            value={empresa.natureza_juridica} 
          />
        </InfoSection>

        {/* Atividades */}
        <InfoSection icon={InfoIcon} title="Atividades Econômicas">
          <InfoItem 
            label="CNAE Principal" 
            value={empresa.cnae_fiscal_principal?.join(', ')}
            xs={12}
          />
          <InfoItem 
            label="CNAEs Secundários" 
            value={empresa.cnae_fiscal_secundaria?.join(', ')}
            xs={12}
          />
        </InfoSection>

        {/* Datas */}
        <InfoSection icon={EventIcon} title="Datas">
          <InfoItem 
            label="Data de Abertura" 
            value={formatarData(empresa.data_de_inicio_atividade)} 
          />
          <InfoItem 
            label="Data da Situação Cadastral" 
            value={formatarData(empresa.data_situacao_cadastral)} 
          />
          <InfoItem 
            label="Data da Situação Especial" 
            value={formatarData(empresa.data_da_situacao_especial)} 
          />
        </InfoSection>

        {/* Contato */}
        <InfoSection icon={PhoneIcon} title="Contato">
          <InfoItem 
            label="Telefone Principal" 
            value={formatarTelefone(empresa.ddd1, empresa.telefone1)} 
          />
          <InfoItem 
            label="Telefone Secundário" 
            value={formatarTelefone(empresa.ddd2, empresa.telefone2)} 
          />
          <InfoItem 
            label="Fax" 
            value={formatarTelefone(empresa.ddd_do_fax, empresa.fax)} 
          />
          <InfoItem 
            label="E-mail" 
            value={empresa.correio_eletronico} 
          />
        </InfoSection>

        {/* Endereço */}
        <InfoSection icon={LocationIcon} title="Localização">
          <InfoItem label="CEP" value={empresa.cep} />
          <InfoItem label="UF" value={empresa.uf} />
          <InfoItem 
            label="Endereço" 
            value={capitalizeFirstLetter(
              `${empresa.logradouro}, ${empresa.numero}${empresa.complemento ? `, ${empresa.complemento}` : ''}`
            )}
            xs={12}
          />
          <InfoItem 
            label="Bairro" 
            value={capitalizeFirstLetter(empresa.bairro)} 
          />
          <InfoItem 
            label="Município" 
            value={capitalizeFirstLetter(empresa.municipio)} 
          />
          {empresa.nome_da_cidade_no_exterior && (
            <InfoItem 
              label="Cidade no Exterior" 
              value={capitalizeFirstLetter(empresa.nome_da_cidade_no_exterior)} 
            />
          )}
          {empresa.pais && (
            <InfoItem 
              label="País" 
              value={capitalizeFirstLetter(empresa.pais)} 
            />
          )}
        </InfoSection>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button variant="contained" onClick={onClose}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetalheEmpresaModal;