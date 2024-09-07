# import the necessary packages
import numpy as np
import imutils
import cv2, json, sys, os

# read temp and image
template = cv2.imread(sys.argv[1])
image = cv2.imread(sys.argv[2])

cv2.imwrite(sys.argv[2].replace('.png', '_debug.png'), image)

image = cv2.resize(image, (int(sys.argv[3]),int(sys.argv[4])))

# load the image image, convert it to grayscale, and detect edges
template = cv2.cvtColor(template, cv2.COLOR_BGR2GRAY)
template = cv2.Canny(template, 50, 200)
(tH, tW) = template.shape[:2]

# load the image, convert it to grayscale, and initialize the
# bookkeeping variable to keep track of the matched region
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
found = None

# loop over the scales of the image
for scale in np.linspace(0.2, 1.0, 20)[::-1]:
    # resize the image according to the scale, and keep track
    # of the ratio of the resizing
    resized = imutils.resize(gray, width = int(gray.shape[1] * scale))
    r = gray.shape[1] / float(resized.shape[1])

    # if the resized image is smaller than the template, then break
    # from the loop
    if resized.shape[0] < tH or resized.shape[1] < tW:
        break

    # detect edges in the resized, grayscale image and apply template
    # matching to find the template in the image
    edged = cv2.Canny(resized, 50, 200)
    result = cv2.matchTemplate(edged, template, cv2.TM_CCOEFF)
    (_, maxVal, _, maxLoc) = cv2.minMaxLoc(result)

    # if we have found a new maximum correlation value, then ipdate
    # the bookkeeping variable
    if found is None or maxVal > found[0]:
        found = (maxVal, maxLoc, r)

# unpack the bookkeeping varaible and compute the (x, y) coordinates
# of the bounding box based on the resized ratio
(_, maxLoc, r) = found
(startX, startY) = (int(maxLoc[0] * r), int(maxLoc[1] * r))
(endX, endY) = (int((maxLoc[0] + tW) * r), int((maxLoc[1] + tH) * r))

# draw a bounding box around the detected result and display the image
cv2.rectangle(image, (startX, startY), (endX, endY), (0, 0, 255), 2)
(circleX, circleY) = (round(startX+((endX-startX)/2))), (round(startY+((endY-startY)/2)))
cv2.circle(image, (circleX, circleY), 4, (0,0,255),2)

os.remove(sys.argv[2])
cv2.imwrite(sys.argv[2], image)

print({ "x": circleX, "y": circleY})