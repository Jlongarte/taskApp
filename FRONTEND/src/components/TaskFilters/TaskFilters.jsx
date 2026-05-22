const TaskFilters = ({ filters, setFilters }) => {
  return (
    <section>
      <select
        value={filters.status}
        onChange={(ev) => setFilters({ ...filters, status: ev.target.value })}
      ></select>
    </section>
  );
};
