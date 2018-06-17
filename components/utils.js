
export function deserialize(schedules) {
  const data = JSON.parse(schedules);
  return data.map(item => ({ ...item, from: new Date(item.from), to: new Date(item.to) }));
}

