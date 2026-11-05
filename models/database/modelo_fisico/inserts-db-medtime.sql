use db_medtime;

# ========== DADOS INICIAIS ==========

# Tabela Role
insert into tbl_role (role) values
('uso próprio'),
('cuidador'),
('acompanhado');

# Tabela Tipo de dosagem
insert into tbl_tipo_dosagem (tipo_dosagem) values
('comprimido'),
('cápsula'),
('gotas'),
('solução'),
('xarope'),
('suspensão'),
('injeção'),
('pomada'),
('creme'),
('spray');

# Tabela Unidade de medida
insert into tbl_unidade_medida (unidade_medida, sigla) values
('miligrama', 'mg'),
('grama', 'g'),
('mililitro', 'ml'),
('micrograma', 'µg'),
('gota', 'gt'),
('unidade', 'un');

# Tabela Tipo Intervalo
insert into tbl_tipo_intervalo (tipo_intervalo) values
('hora'),
('dia');

insert into tbl_usuarios (
    nome,
    email,
    senha,
    cpf,
    data_nascimento
)
values (
    'Carlos Ribeiro',
    'carlos.teste@example.com',
    'Teste@123',
    '111.222.333-99',
    '1955-06-15'
);

select
    id,
    nome,
    email,
    cpf,
    data_nascimento
from tbl_usuarios;

select
    id,
    frequencia,
    data_hora_inicio,
    data_hora_fim,
    id_tipo_intervalo,
    id_receita_medica
from tbl_programacao_medicamento
where id_receita_medica = 2
order by id;