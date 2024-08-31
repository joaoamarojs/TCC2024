const formatDate = (dateString) => {
  // Cria um objeto Date a partir da string no formato Y-m-d
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day); // Mês é baseado em zero

  // Formata o dia e o mês com dois dígitos
  const dayFormatted = date.getDate().toString().padStart(2, '0');
  const monthFormatted = (date.getMonth() + 1).toString().padStart(2, '0');
  const yearFormatted = date.getFullYear();

  // Retorna a data no formato d/m/Y
  return `${dayFormatted}/${monthFormatted}/${yearFormatted}`;
};

export default formatDate