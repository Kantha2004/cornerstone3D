import RectangleROIStartEndThreshold from './RectangleROIStartEndThreshold';

function validateAnnotation(annotation) {
  if (!annotation?.data) {
    throw new Error('Tool data is empty');
  }

  if (!annotation.metadata || annotation.metadata.referencedImageId) {
    throw new Error('Tool data is not associated with any imageId');
  }
}

class AnnotationToPointData {
  static TOOL_NAMES: Record<string, unknown> = {};

  constructor() {
    // empty
  }

  static convert(annotation, index, metadataProvider) {
    validateAnnotation(annotation);

    const { toolName } = annotation.metadata;
    const toolClass = AnnotationToPointData.TOOL_NAMES[toolName];

    if (!toolClass) {
      throw new Error(
        `Unknown tool type: ${toolName}, cannot convert to RTSSReport`
      );
    }

    // Each toolData should become a list of contours, ContourSequence
    // contains a list of contours with their pointData, their geometry
    // type and their length.
    // @ts-expect-error
    const ContourSequence = toolClass.getContourSequence(
      annotation,
      metadataProvider
    );

    // Todo: random rgb color for now, options should be passed in
    const color = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
    ];

    return {
      ReferencedROINumber: index + 1,
      ROIDisplayColor: color,
      ContourSequence,
    };
  }

  static register(toolClass) {
    AnnotationToPointData.TOOL_NAMES[toolClass.toolName] = toolClass;
  }
}

AnnotationToPointData.register(RectangleROIStartEndThreshold);

export default AnnotationToPointData;
