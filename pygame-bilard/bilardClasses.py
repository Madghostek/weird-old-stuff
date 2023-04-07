from settings import pg, radius, size
from mathfuncts import *
import numpy as np


class Cue:
    def __init__(self):
        self.angle = 0
        self.pos = np.array([0, 0])
        self.dragStart = np.array([0, 0])
        self.deltaDrag = np.array([0, 0])

    def update(self, b):
        self.pos = b.pos
        mouse = np.array(pg.mouse.get_pos())
        if pg.mouse.get_pressed()[0]:
            self.dragStart = mouse if not self.dragStart[0] else self.dragStart
        elif self.deltaDrag[0] or self.deltaDrag[1]:
            # push ball if dragged
            b.vel = self.deltaDrag / 100
            b.moving = True
            self.dragStart.fill(0)
            self.deltaDrag.fill(0)
            # change player turn here
        else:
            self.dragStart.fill(0)  # if mouse released but cue not retracted
        if self.dragStart[0]:
            delta = np.subtract(self.dragStart, mouse)
            # project delta onto line with angle - multiply normalised vector by scalar projection
            norm = [math.sin(self.angle), math.cos(self.angle)]
            self.deltaDrag = np.multiply(np.divide(np.dot(delta, norm), np.dot(norm, norm)), norm)
            test = np.multiply(self.deltaDrag, norm)  # when dragged in wrong direction both components will be positive
            if test[0] > 0:
                self.deltaDrag.fill(0)
        else:
            # rotate to mouse
            p = mouse - b.pos
            self.angle = math.atan2(*p)

    def draw(self):
        d = np.array([math.sin(self.angle) * (150 * size) / 10, math.cos(self.angle) * (150 * size) / 10])
        a = self.pos - self.deltaDrag + d
        pg.draw.line(pg.display.get_surface(), (220, 200, 200), a, a + d * 10, 8 * size)
        pg.draw.circle(pg.display.get_surface(), (220, 200, 200), np.rint(a).astype(int), 4 * size)


class Ball:
    def __init__(self, x, y, c):
        self.pos = np.array([x, y]).astype(float)
        self.vel = np.array([0., 0.])
        self.c = c
        self.moving = False

    def reset(self):
        self.pos = np.array([400 / 2, 800 / 2])

    def draw(self):
        pg.draw.circle(pg.display.get_surface(), self.c, np.rint(self.pos).astype(int) * size, round(radius * size))

    def bounce_ball(self, b):
        # wikiepdia
        loss = 0.95
        temp1 = self.pos - b.pos
        temp2 = b.pos - self.pos
        self.vel, b.vel = loss * (
                    self.vel - (self.vel - b.vel) @ temp1 / (np.linalg.norm(temp1) ** 2) * temp1), loss * (
                                      b.vel - (b.vel - self.vel) @ temp2 / (np.linalg.norm(temp2) ** 2) * temp2)

    def bounce_bumper(self, line):
        # reflect the velocity vector, norm contains 1 or -1 - reflect or not
        norm = np.array([normalise_int(line[1][0] - line[0][0]), normalise_int(line[1][1] - line[0][1])])
        self.vel *= norm / 1.2  # /2 energy loss
        # push ball out of the wall so it doesn't "stick"
        # norm tells which way to bounce, so it will also tell which way to push
        # line[0][0] if norm[0]==-1, else line[0][1] - goal pos
        # ball.x or y = ^result+-radius, x if -1 etc
        # radius is tricky because we can either add or substract, direction is taken from vel sign
        if norm[0] == -1:
            self.pos[0] = line[0][0] + (radius * size) * normalise_int(self.vel[0])
        else:
            self.pos[1] = line[0][1] + (radius * size) * normalise_int(self.vel[1])

    def calculateCollision(self, a):  # between line and ball
        if dist_to_middle(self.pos, a) < line_len(a) / 2 and dist_to_line(self.pos, a[0], a[1]) < radius * size:
            return True
        return False

    def collideBumpers(self, walls):
        for bumper in walls:
            for i in range(len(bumper.points) - 1):
                line = (bumper.points[i], bumper.points[i + 1])
                if self.calculateCollision(line):
                    self.bounce_bumper(line)
                    break
        # apply velocity, should be in different function
        self.pos += self.vel
        # friction
        self.vel *= 0.997
        if np.linalg.norm(self.vel) <= 0.005:
            self.moving = False
            self.vel.fill(0)
        else:  # if vector is nonzero
            self.moving = True

    def collideBalls(self, balls):
        for b in balls:
            if b == self:
                continue
            dist = dist_points(b.pos, self.pos)
            if dist <= radius * 2:
                self.bounce_ball(b)
                # unstick, move each by (dist-2r)/2 (opposete directions)
                d1 = np.add(self.pos, (self.pos / 2 - b.pos / 2) * (2 * radius - dist) / (2 * radius))
                d2 = np.add(b.pos, (b.pos / 2 - self.pos / 2) * (2 * radius - dist) / (2 * radius))
                self.pos = d1
                b.pos = d2
                b.moving = True

    def interactHoles(self, holes):
        for h in holes:
            if dist_points(h.pos, self.pos) <= radius / 2 + h.r:
                return 1  # remove from list
        return 0


class Hole:
    def __init__(self, x, y, r):
        self.r = round(r * size)
        self.pos = np.array([x, y]) * size

    def draw(self):
        pg.draw.circle(pg.display.get_surface(), (0, 0, 0), self.pos, self.r)


class Wall:
    def __init__(self, x, y, w, h, c):
        self.x = x * size
        self.y = y * size
        self.w = w * size
        self.h = h * size
        self.color = c

    def draw(self):
        pg.draw.rect(pg.display.get_surface(), self.color, (self.x, self.y, self.w, self.h))


class Poly:
    def __init__(self, points, c):
        self.points = []
        for x in points:
            self.points.append([y * size for y in x])
        self.color = c

    def draw(self):
        pg.draw.polygon(pg.display.get_surface(), self.color, self.points)
