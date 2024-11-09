import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Grid2,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Alert,
  CircularProgress,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import InfoIcon from '@mui/icons-material/Info';

import DetalheEmpresaModal from '../components/ModalEmpresa';
import Header from '../components/Header';

const EmpresaPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);

  // Estados para paginação
  const [pagina, setPagina] = useState(0);
  const [tamanho, setTamanho] = useState(10);
  const [total, setTotal] = useState(0);

  // Estados para filtros
  const [filtros, setFiltros] = useState({
    nome: '',
    cnpj: '',
    matriz: '',
    cep: '',
    uf: '',
    capital_min: '',
    capital_max: '',
    porte_empresa: '',
    abertura_de: '',
    abertura_ate: ''
  });

  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.toLowerCase().split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const buildQueryString = () => {
    const params = new URLSearchParams();
    params.append('pagina', pagina + 1);
    params.append('tamanho', tamanho);

    Object.entries(filtros).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });

    return params.toString();
  };

  const buscarEmpresas = async () => {
    try {
      setLoading(true);
      setError(null);
      const queryString = buildQueryString();
      const response = await axios.get(`http://localhost:8000/api/v1/empresas/?${queryString}`);

      setEmpresas(response.data.message.resposta || []);
      setTotal(response.data.message.total_registros || 0);
    } catch (err) {
      setError('Erro ao buscar empresas: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (name, value) => {
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLimparFiltros = () => {
    setFiltros({
      nome: '',
      cnpj: '',
      matriz: '',
      cep: '',
      uf: '',
      capital_min: '',
      capital_max: '',
      porte_empresa: '',
      abertura_de: '',
      abertura_ate: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPagina(0);
    buscarEmpresas();
  };

  const handleDetalhes = (empresa) => {
    setEmpresaSelecionada(empresa);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEmpresaSelecionada(null);
  };


  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  useEffect(() => {
    buscarEmpresas();
  }, [pagina, tamanho]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Busca de Empresas
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid2 container spacing={2}>
              {/* Nome e CNPJ */}
              <Grid2 item xs={12} sm={12} md={6}>
                <TextField
                  fullWidth
                  label="Nome da Empresa"
                  value={filtros.nome}
                  onChange={(e) => handleFiltroChange('nome', e.target.value)}
                />
              </Grid2>
              <Grid2 item xs={12} sm={12} md={6}>
                <TextField
                  fullWidth
                  label="CNPJ"
                  value={filtros.cnpj}
                  onChange={(e) => handleFiltroChange('cnpj', e.target.value)}
                />
              </Grid2>

              {/* Matriz/Filial e Porte */}
              <Grid2 item xs={12} sm={6} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    value={filtros.matriz}
                    label="Tipo"
                    onChange={(e) => handleFiltroChange('matriz', e.target.value)}
                    sx={{
                      '& .MuiSelect-select': {
                        minWidth: '177px',
                      }
                    }}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="1">Matriz</MenuItem>
                    <MenuItem value="2">Filial</MenuItem>
                  </Select>
                </FormControl>
              </Grid2>
              <Grid2 item xs={12} sm={6} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Porte da Empresa</InputLabel>
                  <Select
                    value={filtros.porte_empresa}
                    label="Porte da Empresa"
                    onChange={(e) => handleFiltroChange('porte_empresa', e.target.value)}
                    sx={{
                      '& .MuiSelect-select': {
                        minWidth: '177px',
                      }
                    }}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="Micro Empresa">Micro Empresa</MenuItem>
                    <MenuItem value="Empresa de Pequeno Porte">Empresa de Pequeno Porte</MenuItem>
                    <MenuItem value="Demais">Demais</MenuItem>
                    <MenuItem value="Não Informado">Não Informado</MenuItem>
                  </Select>
                </FormControl>
              </Grid2>

              {/* CEP e UF */}
              <Grid2 item xs={12} sm={6} md={6}>
                <TextField
                  fullWidth
                  label="CEP"
                  value={filtros.cep}
                  onChange={(e) => handleFiltroChange('cep', e.target.value)}
                />
              </Grid2>
              <Grid2 item xs={12} sm={6} md={6}>
                <TextField
                  fullWidth
                  label="UF"
                  value={filtros.uf}
                  onChange={(e) => handleFiltroChange('uf', e.target.value)}
                  inputProps={{ maxLength: 2 }}
                />
              </Grid2>

              {/* Capital */}
              <Grid2 item xs={12} sm={6} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Capital Mínimo"
                  value={filtros.capital_min}
                  onChange={(e) => handleFiltroChange('capital_min', e.target.value)}
                />
              </Grid2>
              <Grid2 item xs={12} sm={6} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Capital Máximo"
                  value={filtros.capital_max}
                  onChange={(e) => handleFiltroChange('capital_max', e.target.value)}
                />
              </Grid2>

              <Grid2 item xs={12} sm={6} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Data de Abertura (De)"
                  value={filtros.abertura_de}
                  onChange={(e) => handleFiltroChange('abertura_de', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid2>
              <Grid2 item xs={12} sm={6} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Data de Abertura (Até)"
                  value={filtros.abertura_ate}
                  onChange={(e) => handleFiltroChange('abertura_ate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid2>
            </Grid2>

            <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                onClick={handleLimparFiltros}
                startIcon={<ClearIcon />}
                fullWidth={isMobile}
              >
                Limpar Filtros
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                disabled={loading}
                fullWidth={isMobile}
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </Button>
            </Box>
          </form>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>CNPJ</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Porte</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Capital Social</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Data de Abertura</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>UF</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {empresas.map((empresa) => (
                  <TableRow key={empresa.id}>
                    <TableCell>{capitalizeFirstLetter(empresa.razao_social_nome_empresarial)}</TableCell>
                    <TableCell>{empresa.cnpj}</TableCell>
                    <TableCell>{empresa.matriz === '1' ? 'Matriz' : 'Filial'}</TableCell>
                    <TableCell>{capitalizeFirstLetter(empresa.porte_empresa)}</TableCell>
                    <TableCell>{formatarMoeda(empresa.capital_social)}</TableCell>
                    <TableCell>{formatarData(empresa.data_de_inicio_atividade)}</TableCell>
                    <TableCell>{empresa.uf}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleDetalhes(empresa)}
                        size="small"
                        aria-label="detalhes"
                      >
                        <InfoIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={total}
            page={pagina}
            onPageChange={(e, newPage) => setPagina(newPage)}
            rowsPerPage={tamanho}
            onRowsPerPageChange={(e) => {
              setTamanho(parseInt(e.target.value, 10));
              setPagina(0);
            }}
            labelRowsPerPage="Itens por página"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count}`
            }
            rowsPerPageOptions={[10, 20, 50]}
          />
        </Paper>
        <DetalheEmpresaModal
          open={modalOpen}
          empresa={empresaSelecionada}
          onClose={handleCloseModal}
        />
      </Container>
    </div>
  );
};

export default EmpresaPage;