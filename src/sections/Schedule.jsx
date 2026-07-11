import Button from "../components/Button.jsx";
import SectionHeading from "../components/SectionHeading.jsx";

export default function Schedule({ homepage }) {
  const schedule = homepage.schedule;

  return (
    <section className="section ivory" id={schedule.id}>
      <div className="container">
        <SectionHeading section={schedule} />
        <div className="schedule-table-wrap">
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Batch</th>
                <th>Days</th>
                <th>Time</th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody>
              {schedule.batches.map((batch) => (
                <tr key={batch.group}>
                  <td>{batch.group}</td>
                  <td>{batch.days}</td>
                  <td>{batch.time}</td>
                  <td>{batch.availability}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="schedule-cards">
          {schedule.batches.map((batch) => (
            <article className="schedule-card" key={batch.group}>
              <h3>{batch.group}</h3>
              <dl>
                <div>
                  <dt>Days</dt>
                  <dd>{batch.days}</dd>
                </div>
                <div>
                  <dt>Time</dt>
                  <dd>{batch.time}</dd>
                </div>
                <div>
                  <dt>Availability</dt>
                  <dd>{batch.availability}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
        <div className="notice-row">
          <p>{schedule.notice}</p>
          <Button href={schedule.cta.href}>{schedule.cta.label}</Button>
        </div>
      </div>
    </section>
  );
}
