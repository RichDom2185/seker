from spike import PrimeHub

hub = PrimeHub()
hub.light_matrix.off()
hub.light_matrix.set_pixel(2, 2, 80)
hub.light_matrix.set_pixel(3, 3, 80)
hub.light_matrix.set_pixel(2, 3, 80)
hub.light_matrix.set_pixel(3, 2, 80)
hub.light_matrix.set_pixel(4, 4, 80)
hub.light_matrix.set_pixel(0, 0, 80)
