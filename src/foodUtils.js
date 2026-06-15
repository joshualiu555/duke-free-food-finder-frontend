export function locationLabel(item) {
  if (item.locationDetails) return item.locationDetails
  if (item.latitude != null && item.longitude != null) {
    return `${item.latitude.toFixed(5)}, ${item.longitude.toFixed(5)}`
  }
  return 'Unknown location'
}
