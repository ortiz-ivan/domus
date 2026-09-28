/** Vista en tabla de un gráfico: el mismo dato sin depender del color ni del hover */
export function ChartTable({ title, rows, headers = ['Período', 'Valor'] }: { title: string; rows: [string, string][]; headers?: [string, string] }) {
  return (
    <details className="mt-3 text-sm">
      <summary className="inline-flex min-h-9 cursor-pointer items-center rounded-lg px-2 font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
        Ver datos en tabla
      </summary>
      <table className="mt-2 w-full text-left">
        <caption className="sr-only">{title}</caption>
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th scope="col" className="py-2 font-medium">
              {headers[0]}
            </th>
            <th scope="col" className="py-2 text-right font-medium">
              {headers[1]}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label} className="border-b border-border last:border-0">
              <td className="py-2">{label}</td>
              <td className="py-2 text-right tabular-nums">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  )
}
