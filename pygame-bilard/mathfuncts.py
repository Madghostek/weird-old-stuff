import math


# do 1 lub -1
def normalise_int(a):
    return 1 if a > 0 else -1


# dlugosc lini - dist od pkt do pkt
def line_len(a):
    return dist_points(a[0], a[1])


# odleglosc miedzy punktami - wzor na odleglosc punktow
def dist_points(p, q):
    return math.sqrt(sum((px - qx) ** 2.0 for px, qx in zip(p, q)))


# odleglosc punktu od prostej - iloczyn skalarny
# uwaga, trzeba samemu sprawdzic czy jest poza linia bo to dziala dla prostej
def dist_to_line(p0, p1, p2):
    x_diff = p2[0] - p1[0]
    y_diff = p2[1] - p1[1]
    num = abs(y_diff * p0[0] - x_diff * p0[1] + p2[0] * p1[1] - p2[1] * p1[0])
    den = math.sqrt(y_diff ** 2 + x_diff ** 2)
    return num / den


# odleglosc od srodka - odleglosc pkt w srodku linii, uzywane w parze z powyzej
def dist_to_middle(b, w):
    middle = [(w[0][0] + w[1][0]) / 2, (w[0][1] + w[1][1]) / 2]
    dist = dist_points([b[0], b[1]], middle)
    return dist
