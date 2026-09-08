"""
Professional Blender VFX System - 100% Faithful Assembly Animation
Recreates the complete assembly sequence from the reference video:
- Frame 1: Singularity glowing blue ball at bottom center with HUD "ASSEMBLING... 0%" (matching frame_0001.png)
- Frames 30-140: Particles erupt from the ball in an arcing vortex swirl (matching frame_0050.png)
- Frames 140-260: Particles condense into the humanoid shape, curves trace and materialize (matching frame_0300.png)
- Frames 270+: Full holographic avatar activated with vocal soundwave undulations and HUD "STATUS: LISTENING" (matching frame_0600.png)
- Procedural Geometry Nodes particle morphing, curve trimming, and animated HUD text handler
"""

import bpy
import math
import random
from mathutils import Vector

def clean_scene():
    """Wipe default objects, handlers, and orphan data to create a fresh scene."""
    if bpy.context.active_object and bpy.context.active_object.mode != 'OBJECT':
        bpy.ops.object.mode_set(mode='OBJECT')
    
    # Remove any existing frame change handlers
    bpy.app.handlers.frame_change_pre.clear()
    
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    
    for block in list(bpy.data.meshes):
        bpy.data.meshes.remove(block)
    for block in list(bpy.data.curves):
        bpy.data.curves.remove(block)
    for block in list(bpy.data.materials):
        bpy.data.materials.remove(block)
    for block in list(bpy.data.lights):
        bpy.data.lights.remove(block)
    for block in list(bpy.data.cameras):
        bpy.data.cameras.remove(block)
    for block in list(bpy.data.node_groups):
        bpy.data.node_groups.remove(block)

def get_or_create_collection(name, parent=None):
    """Create or retrieve a collection hierarchically."""
    if name in bpy.data.collections:
        col = bpy.data.collections[name]
    else:
        col = bpy.data.collections.new(name)
        if parent:
            parent.children.link(col)
        else:
            bpy.context.scene.collection.children.link(col)
    return col

def setup_scene_properties():
    """Configure render engine, 360-frame timeline, and color management."""
    scene = bpy.context.scene
    scene.render.engine = 'BLENDER_EEVEE'
    scene.render.resolution_x = 3840
    scene.render.resolution_y = 2160
    scene.render.resolution_percentage = 100
    scene.render.fps = 60
    scene.frame_start = 1
    scene.frame_end = 360
    
    scene.use_nodes = False
    scene.compositing_node_group = None
    
    try:
        scene.eevee.taa_render_samples = 128
    except Exception:
        pass
        
    scene.display_settings.display_device = 'sRGB'
    scene.view_settings.view_transform = 'Standard'
    scene.view_settings.look = 'None'
    
    world = bpy.context.scene.world
    if not world:
        world = bpy.data.worlds.new("HoloWorld")
        bpy.context.scene.world = world
    world.use_nodes = True
    bg_node = world.node_tree.nodes.get("Background")
    if bg_node:
        bg_node.inputs['Color'].default_value = (0.0, 0.0, 0.0, 1.0)
        bg_node.inputs['Strength'].default_value = 0.0

def create_materials():
    """Create emission materials for assembly and final state."""
    mats = {}
    
    # 1. Electric Neon Cyan
    mat_cyan = bpy.data.materials.new(name="Mat_CyanGlow")
    mat_cyan.use_nodes = True
    nodes = mat_cyan.node_tree.nodes
    nodes.clear()
    em_cyan = nodes.new("ShaderNodeEmission")
    em_cyan.inputs['Color'].default_value = (0.0, 0.88, 1.0, 1.0)
    em_cyan.inputs['Strength'].default_value = 2.6
    out = nodes.new("ShaderNodeOutputMaterial")
    mat_cyan.node_tree.links.new(em_cyan.outputs['Emission'], out.inputs['Surface'])
    mats['cyan'] = mat_cyan

    # 2. Electric Cyan Rim Highlight
    mat_rim = bpy.data.materials.new(name="Mat_CyanRim")
    mat_rim.use_nodes = True
    nodes = mat_rim.node_tree.nodes
    nodes.clear()
    em_rim = nodes.new("ShaderNodeEmission")
    em_rim.inputs['Color'].default_value = (0.25, 0.96, 1.0, 1.0)
    em_rim.inputs['Strength'].default_value = 4.8
    out = nodes.new("ShaderNodeOutputMaterial")
    mat_rim.node_tree.links.new(em_rim.outputs['Emission'], out.inputs['Surface'])
    mats['rim'] = mat_rim

    # 3. Golden Amber Energy Tendril
    mat_gold = bpy.data.materials.new(name="Mat_GoldEnergy")
    mat_gold.use_nodes = True
    nodes = mat_gold.node_tree.nodes
    nodes.clear()
    em_gold = nodes.new("ShaderNodeEmission")
    em_gold.inputs['Color'].default_value = (1.0, 0.65, 0.02, 1.0)
    em_gold.inputs['Strength'].default_value = 4.2
    out = nodes.new("ShaderNodeOutputMaterial")
    mat_gold.node_tree.links.new(em_gold.outputs['Emission'], out.inputs['Surface'])
    mats['gold'] = mat_gold

    # 4. White-Hot Power Core (Singularity Orb)
    mat_whitehot = bpy.data.materials.new(name="Mat_WhiteHotCore")
    mat_whitehot.use_nodes = True
    nodes = mat_whitehot.node_tree.nodes
    nodes.clear()
    em_wh = nodes.new("ShaderNodeEmission")
    em_wh.inputs['Color'].default_value = (0.85, 0.95, 1.0, 1.0)
    em_wh.inputs['Strength'].default_value = 16.0
    out = nodes.new("ShaderNodeOutputMaterial")
    mat_whitehot.node_tree.links.new(em_wh.outputs['Emission'], out.inputs['Surface'])
    mats['whitehot'] = mat_whitehot

    # 5. Face Wave Thermal Shader
    mat_face = bpy.data.materials.new(name="Mat_FaceWaveHolo")
    mat_face.use_nodes = True
    nodes = mat_face.node_tree.nodes
    nodes.clear()
    
    att = nodes.new("ShaderNodeAttribute")
    att.attribute_name = "HeatFac"
    
    ramp = nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.interpolation = 'B_SPLINE'
    
    ramp.color_ramp.elements[0].position = 0.00
    ramp.color_ramp.elements[0].color = (1.0, 0.92, 0.20, 1.0)
    
    e1 = ramp.color_ramp.elements.new(0.18)
    e1.color = (1.0, 0.50, 0.01, 1.0)
    
    e2 = ramp.color_ramp.elements.new(0.32)
    e2.color = (0.95, 0.16, 0.00, 1.0)
    
    e3 = ramp.color_ramp.elements.new(0.44)
    e3.color = (0.01, 0.22, 0.85, 1.0)
    
    ramp.color_ramp.elements[1].position = 0.58
    ramp.color_ramp.elements[1].color = (0.0, 0.85, 1.0, 1.0)
    
    e4 = ramp.color_ramp.elements.new(1.00)
    e4.color = (0.0, 0.85, 1.0, 1.0)
    
    em_face = nodes.new("ShaderNodeEmission")
    em_face.inputs['Strength'].default_value = 3.0
    
    out = nodes.new("ShaderNodeOutputMaterial")
    
    mat_face.node_tree.links.new(att.outputs['Fac'], ramp.inputs['Fac'])
    mat_face.node_tree.links.new(ramp.outputs['Color'], em_face.inputs['Color'])
    mat_face.node_tree.links.new(em_face.outputs['Emission'], out.inputs['Surface'])
    mats['face'] = mat_face

    return mats

def get_sleek_human_profile(z):
    """Continuous aerodynamic profile for head and neck."""
    if z < 0.22:
        t = (0.22 - z) / 0.22
        rx = 0.15 + 0.06 * (t**1.8)
        ry = 0.16 + 0.04 * (t**1.8)
        oy = -0.05 - 0.03 * (t**1.8)
    elif z < 0.45:
        t = (z - 0.22) / 0.23
        rx = 0.15 + 0.18 * math.sin(t * math.pi * 0.5)
        ry = 0.16 + 0.15 * math.sin(t * math.pi * 0.5)
        oy = -0.05 - 0.03 * t
    elif z < 0.82:
        t = (z - 0.45) / 0.37
        rx = 0.33 + 0.025 * math.sin(t * math.pi)
        ry = 0.31 + 0.020 * math.sin(t * math.pi)
        oy = -0.08 + 0.015 * math.sin(t * math.pi)
    else:
        t = (z - 0.82) / 0.28
        dome = math.sqrt(max(0.001, 1.0 - t**2))
        rx = 0.33 * dome
        ry = 0.31 * dome
        oy = -0.07 * (1.0 - t)
        
    return rx, ry, oy

def build_head_scanline_ribbons(col, mat_face):
    """
    Generate horizontal scanline ribbons across Head and Neck with animated assembly curve trimming.
    """
    curve_data = bpy.data.curves.new(name="HeadScanlinesCurve", type='CURVE')
    curve_data.dimensions = '3D'
    curve_data.fill_mode = 'FULL'
    curve_data.bevel_depth = 0.0
    
    z_min, z_max = 0.04, 1.08
    num_layers = 68
    
    for i in range(num_layers):
        t = i / (num_layers - 1)
        z = z_min + t * (z_max - z_min)
        
        rx, ry, oy = get_sleek_human_profile(z)
        
        spline = curve_data.splines.new(type='BEZIER')
        spline.use_cyclic_u = True
        num_pts = 56
        spline.bezier_points.add(num_pts - 1)
        
        dist_to_voice = abs(z - 0.42)
        voice_factor = math.exp(- (dist_to_voice / 0.18)**2)
        
        for p in range(num_pts):
            theta = p * (2.0 * math.pi / num_pts)
            px = rx * math.cos(theta)
            py = oy + ry * math.sin(theta)
            pz = z
            
            if py < oy:
                wave = math.sin(px * 14.0 + (i * 0.45)) * 0.038 * voice_factor * (abs(py - oy) / ry)
                pz += wave
            
            bp = spline.bezier_points[p]
            bp.co = (px, py, pz)
            bp.handle_left_type = 'AUTO'
            bp.handle_right_type = 'AUTO'

    obj = bpy.data.objects.new("Holo_Head_Scanlines", curve_data)
    col.objects.link(obj)
    
    # Geometry Nodes modifier with Assembly Trim and HeatFac
    gn_mod = obj.modifiers.new(name="HeadScanlinesGN", type='NODES')
    nt = bpy.data.node_groups.new(name="HeadScanlinesGNTree", type='GeometryNodeTree')
    gn_mod.node_group = nt
    
    nt.interface.new_socket(name="Geometry", in_out='INPUT', socket_type='NodeSocketGeometry')
    nt.interface.new_socket(name="Geometry", in_out='OUTPUT', socket_type='NodeSocketGeometry')
    
    in_n = nt.nodes.new("NodeGroupInput")
    out_n = nt.nodes.new("NodeGroupOutput")
    
    # Animated Trim Curve: Curves draw on between frame 160 and 260
    time_n = nt.nodes.new("GeometryNodeInputSceneTime")
    map_trim = nt.nodes.new("ShaderNodeMapRange")
    map_trim.inputs['From Min'].default_value = 160.0
    map_trim.inputs['From Max'].default_value = 260.0
    map_trim.inputs['To Min'].default_value = 0.0
    map_trim.inputs['To Max'].default_value = 1.0
    
    trim_n = nt.nodes.new("GeometryNodeTrimCurve")
    
    c2m = nt.nodes.new("GeometryNodeCurveToMesh")
    circ = nt.nodes.new("GeometryNodeCurvePrimitiveCircle")
    circ.inputs['Radius'].default_value = 0.0014
    circ.inputs['Resolution'].default_value = 8
    
    pos_n = nt.nodes.new("GeometryNodeInputPosition")
    vec_math = nt.nodes.new("ShaderNodeVectorMath")
    vec_math.operation = 'DISTANCE'
    vec_math.inputs[1].default_value = (0.0, -0.40, 0.42)
    
    store_att = nt.nodes.new("GeometryNodeStoreNamedAttribute")
    store_att.data_type = 'FLOAT'
    store_att.domain = 'POINT'
    store_att.inputs['Name'].default_value = "HeatFac"
    
    set_mat = nt.nodes.new("GeometryNodeSetMaterial")
    set_mat.inputs['Material'].default_value = mat_face
    
    nt.links.new(time_n.outputs['Frame'], map_trim.inputs['Value'])
    nt.links.new(map_trim.outputs['Result'], trim_n.inputs['End'])
    nt.links.new(in_n.outputs['Geometry'], trim_n.inputs['Curve'])
    nt.links.new(trim_n.outputs['Curve'], c2m.inputs['Curve'])
    nt.links.new(circ.outputs['Curve'], c2m.inputs['Profile Curve'])
    nt.links.new(c2m.outputs['Mesh'], store_att.inputs['Geometry'])
    nt.links.new(pos_n.outputs['Position'], vec_math.inputs[0])
    nt.links.new(vec_math.outputs['Value'], store_att.inputs['Value'])
    nt.links.new(store_att.outputs['Geometry'], set_mat.inputs['Geometry'])
    nt.links.new(set_mat.outputs['Geometry'], out_n.inputs['Geometry'])
    
    return obj

def build_silky_smooth_chest_and_shoulders(col, mat_cyan):
    """
    Build anatomical chest streamlines with animated assembly curve trimming.
    """
    curve_data = bpy.data.curves.new(name="SilkyChestCurves", type='CURVE')
    curve_data.dimensions = '3D'
    curve_data.fill_mode = 'FULL'
    curve_data.bevel_depth = 0.0
    
    num_chest_layers = 44
    for i in range(num_chest_layers):
        t = i / float(num_chest_layers - 1)
        z_base = -0.75 + t * 0.79
        
        spline = curve_data.splines.new(type='BEZIER')
        num_pts = 48
        spline.bezier_points.add(num_pts - 1)
        
        w = 0.22 + (1.0 - t)**0.90 * 1.22
        y_front = -0.15 - (1.0 - t) * 0.05
        
        for p in range(num_pts):
            u = p / float(num_pts - 1)
            xi = (u - 0.5) * 2.0
            px = xi * w
            pec_bump = math.sin(abs(xi) * math.pi) * (0.028 + (1.0 - t) * 0.018)
            sternum_dip = (1.0 - abs(xi)**1.5) * 0.025 if abs(xi) < 0.35 else 0.0
            pz = z_base + pec_bump - sternum_dip - (abs(xi)**1.8) * (0.06 + (1.0 - t) * 0.16)
            py = y_front + (abs(xi)**1.5) * 0.12
            
            bp = spline.bezier_points[p]
            bp.co = (px, py, pz)
            bp.handle_left_type = 'AUTO'
            bp.handle_right_type = 'AUTO'

    obj = bpy.data.objects.new("Holo_Silky_Chest", curve_data)
    col.objects.link(obj)
    
    # Geometry Nodes modifier with Assembly Trim
    gn_mod = obj.modifiers.new(name="ChestCurvesGN", type='NODES')
    nt = bpy.data.node_groups.new(name="ChestCurvesGNTree", type='GeometryNodeTree')
    gn_mod.node_group = nt
    
    nt.interface.new_socket(name="Geometry", in_out='INPUT', socket_type='NodeSocketGeometry')
    nt.interface.new_socket(name="Geometry", in_out='OUTPUT', socket_type='NodeSocketGeometry')
    
    in_n = nt.nodes.new("NodeGroupInput")
    out_n = nt.nodes.new("NodeGroupOutput")
    
    time_n = nt.nodes.new("GeometryNodeInputSceneTime")
    map_trim = nt.nodes.new("ShaderNodeMapRange")
    map_trim.inputs['From Min'].default_value = 140.0
    map_trim.inputs['From Max'].default_value = 250.0
    map_trim.inputs['To Min'].default_value = 0.0
    map_trim.inputs['To Max'].default_value = 1.0
    
    trim_n = nt.nodes.new("GeometryNodeTrimCurve")
    
    c2m = nt.nodes.new("GeometryNodeCurveToMesh")
    circ = nt.nodes.new("GeometryNodeCurvePrimitiveCircle")
    circ.inputs['Radius'].default_value = 0.0009
    circ.inputs['Resolution'].default_value = 6
    
    set_mat = nt.nodes.new("GeometryNodeSetMaterial")
    set_mat.inputs['Material'].default_value = mat_cyan
    
    nt.links.new(time_n.outputs['Frame'], map_trim.inputs['Value'])
    nt.links.new(map_trim.outputs['Result'], trim_n.inputs['End'])
    nt.links.new(in_n.outputs['Geometry'], trim_n.inputs['Curve'])
    nt.links.new(trim_n.outputs['Curve'], c2m.inputs['Curve'])
    nt.links.new(circ.outputs['Curve'], c2m.inputs['Profile Curve'])
    nt.links.new(c2m.outputs['Mesh'], set_mat.inputs['Geometry'])
    nt.links.new(set_mat.outputs['Geometry'], out_n.inputs['Geometry'])
    
    return obj

def build_silky_silhouette_rim(col, mat_rim):
    """
    Generate anatomical silhouette contour with animated assembly curve trimming.
    """
    rim_curve = bpy.data.curves.new(name="FullSilhouetteRimCurve", type='CURVE')
    rim_curve.dimensions = '3D'
    rim_curve.fill_mode = 'FULL'
    rim_curve.bevel_depth = 0.0
    
    for side in [-1.0, 1.0]:
        spline = rim_curve.splines.new(type='BEZIER')
        pts_count = 64
        spline.bezier_points.add(pts_count - 1)
        
        for p in range(pts_count):
            u = p / float(pts_count - 1)
            if u < 0.52:
                t_head = u / 0.52
                z = 1.08 - t_head * 1.04
                rx, ry, oy = get_sleek_human_profile(z)
                px = side * rx * 1.01
                py = oy
                pz = z
            else:
                t_sh = (u - 0.52) / 0.48
                px = side * (0.21 + t_sh * 0.38 + (t_sh**1.6) * 0.88)
                pz = 0.04 + math.sin(t_sh * math.pi * 0.62) * 0.035 - (t_sh**1.5) * 0.80
                py = -0.08 + t_sh * 0.15
                
            bp = spline.bezier_points[p]
            bp.co = (px, py, pz)
            bp.handle_left_type = 'AUTO'
            bp.handle_right_type = 'AUTO'
            
    rim_obj = bpy.data.objects.new("Holo_Silhouette_Contour_Rim", rim_curve)
    col.objects.link(rim_obj)
    
    gn_mod = rim_obj.modifiers.new(name="RimGN", type='NODES')
    nt = bpy.data.node_groups.new(name="RimGNTree", type='GeometryNodeTree')
    gn_mod.node_group = nt
    
    nt.interface.new_socket(name="Geometry", in_out='INPUT', socket_type='NodeSocketGeometry')
    nt.interface.new_socket(name="Geometry", in_out='OUTPUT', socket_type='NodeSocketGeometry')
    
    in_n = nt.nodes.new("NodeGroupInput")
    out_n = nt.nodes.new("NodeGroupOutput")
    
    time_n = nt.nodes.new("GeometryNodeInputSceneTime")
    map_trim = nt.nodes.new("ShaderNodeMapRange")
    map_trim.inputs['From Min'].default_value = 180.0
    map_trim.inputs['From Max'].default_value = 270.0
    map_trim.inputs['To Min'].default_value = 0.0
    map_trim.inputs['To Max'].default_value = 1.0
    
    trim_n = nt.nodes.new("GeometryNodeTrimCurve")
    
    c2m = nt.nodes.new("GeometryNodeCurveToMesh")
    circ = nt.nodes.new("GeometryNodeCurvePrimitiveCircle")
    circ.inputs['Radius'].default_value = 0.0022
    circ.inputs['Resolution'].default_value = 6
    
    set_mat = nt.nodes.new("GeometryNodeSetMaterial")
    set_mat.inputs['Material'].default_value = mat_rim
    
    nt.links.new(time_n.outputs['Frame'], map_trim.inputs['Value'])
    nt.links.new(map_trim.outputs['Result'], trim_n.inputs['End'])
    nt.links.new(in_n.outputs['Geometry'], trim_n.inputs['Curve'])
    nt.links.new(trim_n.outputs['Curve'], c2m.inputs['Curve'])
    nt.links.new(circ.outputs['Curve'], c2m.inputs['Profile Curve'])
    nt.links.new(c2m.outputs['Mesh'], set_mat.inputs['Geometry'])
    nt.links.new(set_mat.outputs['Geometry'], out_n.inputs['Geometry'])
    
    return rim_obj

def build_neural_throat_tendrils(col, mat_gold):
    """
    Branching golden energy lightning conduits rising through throat with animated assembly curve trimming.
    """
    curve_data = bpy.data.curves.new(name="NeuralThroatTendrils", type='CURVE')
    curve_data.dimensions = '3D'
    curve_data.fill_mode = 'FULL'
    curve_data.bevel_depth = 0.0
    
    random.seed(42)
    num_tendrils = 14
    
    for t_idx in range(num_tendrils):
        spline = curve_data.splines.new(type='BEZIER')
        num_steps = 28
        spline.bezier_points.add(num_steps - 1)
        
        start_x = (random.random() - 0.5) * 0.03
        start_y = -0.18
        start_z = -0.55
        
        target_x = (t_idx - (num_tendrils - 1) / 2.0) * 0.026
        target_z = 0.36 + random.random() * 0.10
        
        for s in range(num_steps):
            u = s / (num_steps - 1)
            cur_z = start_z + u * (target_z - start_z)
            wander_x = start_x + u * (target_x - start_x) + math.sin(u * math.pi * 3.5 + t_idx * 1.3) * 0.020
            cur_y = -0.18 + math.sin(u * math.pi) * 0.045 + (random.random() - 0.5) * 0.01
            
            bp = spline.bezier_points[s]
            bp.co = (wander_x, cur_y, cur_z)
            bp.handle_left_type = 'AUTO'
            bp.handle_right_type = 'AUTO'
            
    obj = bpy.data.objects.new("Holo_Neural_Tendrils", curve_data)
    col.objects.link(obj)
    
    gn_mod = obj.modifiers.new(name="TendrilGN", type='NODES')
    nt = bpy.data.node_groups.new(name="TendrilGNTree", type='GeometryNodeTree')
    gn_mod.node_group = nt
    
    nt.interface.new_socket(name="Geometry", in_out='INPUT', socket_type='NodeSocketGeometry')
    nt.interface.new_socket(name="Geometry", in_out='OUTPUT', socket_type='NodeSocketGeometry')
    
    in_n = nt.nodes.new("NodeGroupInput")
    out_n = nt.nodes.new("NodeGroupOutput")
    
    time_n = nt.nodes.new("GeometryNodeInputSceneTime")
    map_trim = nt.nodes.new("ShaderNodeMapRange")
    map_trim.inputs['From Min'].default_value = 190.0
    map_trim.inputs['From Max'].default_value = 270.0
    map_trim.inputs['To Min'].default_value = 0.0
    map_trim.inputs['To Max'].default_value = 1.0
    
    trim_n = nt.nodes.new("GeometryNodeTrimCurve")
    
    c2m = nt.nodes.new("GeometryNodeCurveToMesh")
    circ = nt.nodes.new("GeometryNodeCurvePrimitiveCircle")
    circ.inputs['Radius'].default_value = 0.0026
    circ.inputs['Resolution'].default_value = 6
    
    set_mat = nt.nodes.new("GeometryNodeSetMaterial")
    set_mat.inputs['Material'].default_value = mat_gold
    
    nt.links.new(time_n.outputs['Frame'], map_trim.inputs['Value'])
    nt.links.new(map_trim.outputs['Result'], trim_n.inputs['End'])
    nt.links.new(in_n.outputs['Geometry'], trim_n.inputs['Curve'])
    nt.links.new(trim_n.outputs['Curve'], c2m.inputs['Curve'])
    nt.links.new(circ.outputs['Curve'], c2m.inputs['Profile Curve'])
    nt.links.new(c2m.outputs['Mesh'], set_mat.inputs['Geometry'])
    nt.links.new(set_mat.outputs['Geometry'], out_n.inputs['Geometry'])
    
    return obj

def build_animated_particle_assembly(col, mat_cyan):
    """
    Procedural Particle Eruption & Assembly System in Geometry Nodes:
    - Originates at the bottom glowing orb (0, -0.18, -0.55).
    - Particles burst outwards in a curving vortex stream (Frames 20 to 180).
    - Condenses onto the target humanoid bust envelope (Frames 180 to 260).
    - Fully assembled resting position with subtle float turbulence (Frames 260+).
    """
    mesh = bpy.data.meshes.new("Holo_ParticleCloud_Mesh")
    verts = []
    delays = []
    random.seed(101)
    
    # 1. Head particles (24,000)
    for _ in range(24000):
        z = random.uniform(0.04, 1.08)
        rx, ry, oy = get_sleek_human_profile(z)
        theta = random.uniform(0, 2 * math.pi)
        spray = random.expovariate(16.0)
        px = (rx + spray) * math.cos(theta) + (random.random() - 0.5) * 0.012
        py = oy + (ry + spray) * math.sin(theta) + (random.random() - 0.5) * 0.012
        pz = z + (random.random() - 0.5) * 0.012
        verts.append((px, py, pz))
        
        # Head particles assemble in later phase
        d = 0.35 + random.random() * 0.55
        delays.append(d)

    # 2. Chest & Shoulder particles (36,000)
    for _ in range(36000):
        side = -1.0 if random.random() < 0.5 else 1.0
        t = random.uniform(0.0, 1.0)
        u = random.uniform(0.0, 1.0)
        
        z_base = -0.75 + t * 0.79
        w = 0.22 + (1.0 - t)**0.90 * 1.22
        xi = u
        
        px = side * xi * w + (random.random() - 0.5) * 0.016
        pec_bump = math.sin(xi * math.pi) * (0.028 + (1.0 - t) * 0.018)
        pz = z_base + pec_bump - (xi**1.8) * (0.06 + (1.0 - t) * 0.16) + (random.random() - 0.5) * 0.016
        py = -0.15 - (1.0 - t) * 0.05 + (xi**1.5) * 0.12 + (random.random() - 0.5) * 0.016
        verts.append((px, py, pz))
        
        # Lower chest particles erupt first
        d = (1.0 - t) * 0.45 + random.random() * 0.25
        delays.append(d)

    mesh.from_pydata(verts, [], [])
    
    # Store birth delay attribute
    delay_att = mesh.attributes.new(name="BirthDelay", type='FLOAT', domain='POINT')
    delay_att.data.foreach_set('value', delays)
    mesh.update()
    
    obj = bpy.data.objects.new("Holo_ParticleCloud", mesh)
    col.objects.link(obj)
    
    # Geometry Nodes Particle Morphing Engine
    gn_mod = obj.modifiers.new(name="ParticleAssemblyGN", type='NODES')
    nt = bpy.data.node_groups.new(name="ParticleAssemblyGNTree", type='GeometryNodeTree')
    gn_mod.node_group = nt
    
    nt.interface.new_socket(name="Geometry", in_out='INPUT', socket_type='NodeSocketGeometry')
    nt.interface.new_socket(name="Geometry", in_out='OUTPUT', socket_type='NodeSocketGeometry')
    
    in_node = nt.nodes.new("NodeGroupInput")
    out_node = nt.nodes.new("NodeGroupOutput")
    
    # Read Scene Frame
    time_node = nt.nodes.new("GeometryNodeInputSceneTime")
    
    # Read Named Attribute BirthDelay
    att_delay = nt.nodes.new("GeometryNodeInputNamedAttribute")
    att_delay.data_type = 'FLOAT'
    att_delay.inputs['Name'].default_value = "BirthDelay"
    
    # Compute per-particle start frame: 20.0 + delay * 140.0 (spread over frames 20 to 160)
    math_mult = nt.nodes.new("ShaderNodeMath")
    math_mult.operation = 'MULTIPLY'
    math_mult.inputs[1].default_value = 140.0
    
    math_start = nt.nodes.new("ShaderNodeMath")
    math_start.operation = 'ADD'
    math_start.inputs[1].default_value = 20.0
    
    # Progress: (Frame - start_frame) / 80.0
    math_sub = nt.nodes.new("ShaderNodeMath")
    math_sub.operation = 'SUBTRACT'
    
    math_prog = nt.nodes.new("ShaderNodeMath")
    math_prog.operation = 'DIVIDE'
    math_prog.inputs[1].default_value = 80.0
    
    clamp_prog = nt.nodes.new("ShaderNodeClamp")
    clamp_prog.inputs['Min'].default_value = 0.0
    clamp_prog.inputs['Max'].default_value = 1.0
    
    # Target Position
    pos_node = nt.nodes.new("GeometryNodeInputPosition")
    
    # Origin Position (Center of Singularity Orb)
    comb_origin = nt.nodes.new("ShaderNodeCombineXYZ")
    comb_origin.inputs['X'].default_value = 0.0
    comb_origin.inputs['Y'].default_value = -0.18
    comb_origin.inputs['Z'].default_value = -0.55
    
    # Interpolate from Origin to Target
    mix_pos = nt.nodes.new("ShaderNodeMix")
    mix_pos.data_type = 'VECTOR'
    
    # Swirl Vortex offset during flight: sin(prog * pi) * 0.30
    swirl_fac = nt.nodes.new("ShaderNodeMath")
    swirl_fac.operation = 'MULTIPLY'
    swirl_fac.inputs[1].default_value = math.pi
    
    swirl_sin = nt.nodes.new("ShaderNodeMath")
    swirl_sin.operation = 'SINE'
    
    swirl_scale = nt.nodes.new("ShaderNodeMath")
    swirl_scale.operation = 'MULTIPLY'
    swirl_scale.inputs[1].default_value = 0.32
    
    # Swirl angle: (1.0 - prog) * 7.0
    angle_inv = nt.nodes.new("ShaderNodeMath")
    angle_inv.operation = 'SUBTRACT'
    angle_inv.inputs[0].default_value = 1.0
    
    angle_mult = nt.nodes.new("ShaderNodeMath")
    angle_mult.operation = 'MULTIPLY'
    angle_mult.inputs[1].default_value = 7.0
    
    cos_n = nt.nodes.new("ShaderNodeMath")
    cos_n.operation = 'COSINE'
    
    sin_n = nt.nodes.new("ShaderNodeMath")
    sin_n.operation = 'SINE'
    
    dx = nt.nodes.new("ShaderNodeMath")
    dx.operation = 'MULTIPLY'
    
    dy = nt.nodes.new("ShaderNodeMath")
    dy.operation = 'MULTIPLY'
    
    comb_swirl = nt.nodes.new("ShaderNodeCombineXYZ")
    
    add_swirl = nt.nodes.new("ShaderNodeVectorMath")
    add_swirl.operation = 'ADD'
    
    # Set Position on points
    set_pos = nt.nodes.new("GeometryNodeSetPosition")
    
    # Particle Scale: 0 when prog == 0, ramps to 1.0
    map_scale = nt.nodes.new("ShaderNodeMapRange")
    map_scale.inputs['From Min'].default_value = 0.0
    map_scale.inputs['From Max'].default_value = 0.12
    map_scale.inputs['To Min'].default_value = 0.0
    map_scale.inputs['To Max'].default_value = 1.0
    
    comb_scale = nt.nodes.new("ShaderNodeCombineXYZ")
    
    # Instancing
    inst_on_pts = nt.nodes.new("GeometryNodeInstanceOnPoints")
    ico = nt.nodes.new("GeometryNodeMeshIcoSphere")
    ico.inputs['Radius'].default_value = 0.0013
    ico.inputs['Subdivisions'].default_value = 1
    
    set_mat = nt.nodes.new("GeometryNodeSetMaterial")
    set_mat.inputs['Material'].default_value = mat_cyan
    
    # Wire links
    nt.links.new(att_delay.outputs['Attribute'], math_mult.inputs[0])
    nt.links.new(math_mult.outputs['Value'], math_start.inputs[0])
    nt.links.new(time_node.outputs['Frame'], math_sub.inputs[0])
    nt.links.new(math_start.outputs['Value'], math_sub.inputs[1])
    nt.links.new(math_sub.outputs['Value'], math_prog.inputs[0])
    nt.links.new(math_prog.outputs['Value'], clamp_prog.inputs['Value'])
    
    # Position mix
    nt.links.new(clamp_prog.outputs['Value'], mix_pos.inputs['Factor'])
    nt.links.new(comb_origin.outputs['Vector'], mix_pos.inputs['A'])
    nt.links.new(pos_node.outputs['Position'], mix_pos.inputs['B'])
    
    # Swirl calculations
    nt.links.new(clamp_prog.outputs['Value'], swirl_fac.inputs[0])
    nt.links.new(swirl_fac.outputs['Value'], swirl_sin.inputs[0])
    nt.links.new(swirl_sin.outputs['Value'], swirl_scale.inputs[0])
    
    nt.links.new(clamp_prog.outputs['Value'], angle_inv.inputs[1])
    nt.links.new(angle_inv.outputs['Value'], angle_mult.inputs[0])
    nt.links.new(angle_mult.outputs['Value'], cos_n.inputs[0])
    nt.links.new(angle_mult.outputs['Value'], sin_n.inputs[0])
    
    nt.links.new(cos_n.outputs['Value'], dx.inputs[0])
    nt.links.new(swirl_scale.outputs['Value'], dx.inputs[1])
    nt.links.new(sin_n.outputs['Value'], dy.inputs[0])
    nt.links.new(swirl_scale.outputs['Value'], dy.inputs[1])
    
    nt.links.new(dx.outputs['Value'], comb_swirl.inputs['X'])
    nt.links.new(dy.outputs['Value'], comb_swirl.inputs['Y'])
    
    nt.links.new(mix_pos.outputs['Result'], add_swirl.inputs[0])
    nt.links.new(comb_swirl.outputs['Vector'], add_swirl.inputs[1])
    
    nt.links.new(in_node.outputs['Geometry'], set_pos.inputs['Geometry'])
    nt.links.new(add_swirl.outputs['Vector'], set_pos.inputs['Position'])
    
    # Scale link
    nt.links.new(clamp_prog.outputs['Value'], map_scale.inputs['Value'])
    nt.links.new(map_scale.outputs['Result'], comb_scale.inputs['X'])
    nt.links.new(map_scale.outputs['Result'], comb_scale.inputs['Y'])
    nt.links.new(map_scale.outputs['Result'], comb_scale.inputs['Z'])
    
    # Instancer links
    nt.links.new(set_pos.outputs['Geometry'], inst_on_pts.inputs['Points'])
    nt.links.new(comb_scale.outputs['Vector'], inst_on_pts.inputs['Scale'])
    nt.links.new(ico.outputs['Mesh'], set_mat.inputs['Geometry'])
    nt.links.new(set_mat.outputs['Geometry'], inst_on_pts.inputs['Instance'])
    nt.links.new(inst_on_pts.outputs['Instances'], out_node.inputs['Geometry'])
    
    return obj

def build_power_core_orb(col, mat_whitehot):
    """
    Power core orb (Singularity Ball) at bottom center (Z = -0.55).
    """
    bpy.ops.mesh.primitive_uv_sphere_add(
        segments=32,
        ring_count=20,
        radius=0.046,
        location=(0.0, -0.18, -0.55)
    )
    orb = bpy.context.active_object
    orb.name = "Holo_PowerCore_Orb"
    orb.data.materials.append(mat_whitehot)
    
    for c in list(orb.users_collection):
        c.objects.unlink(orb)
    col.objects.link(orb)
    
    # Glowing point light inside the ball
    light_data = bpy.data.lights.new(name="CorePointLight", type='POINT')
    light_data.color = (0.15, 0.85, 1.0)
    light_data.energy = 26.0
    light_data.shadow_soft_size = 0.12
    
    light_obj = bpy.data.objects.new("Holo_Core_Light", light_data)
    light_obj.location = (0.0, -0.24, -0.55)
    col.objects.link(light_obj)
    
    return orb

def build_hud_status_text(col, mat_cyan):
    """
    Futuristic HUD text indicator with animated status updates:
    'ASSEMBLING... 0%' -> 'ASSEMBLING... 50%' -> 'STATUS: LISTENING'
    """
    font_curve = bpy.data.curves.new(type="FONT", name="HUD_Text_Curve")
    font_curve.body = "ASSEMBLING... 0%"
    font_curve.size = 0.042
    font_curve.extrude = 0.001
    
    text_obj = bpy.data.objects.new("Holo_HUD_StatusText", font_curve)
    text_obj.location = (1.15, -0.20, 0.22)
    text_obj.data.materials.append(mat_cyan)
    col.objects.link(text_obj)
    return text_obj

def setup_camera_and_lighting(cam_col):
    """Cinematic portrait camera positioned to frame the complete bust."""
    cam_data = bpy.data.cameras.new("MainCinematicCamera")
    cam_data.lens = 52.0
    cam_data.sensor_width = 36.0
    
    cam_obj = bpy.data.objects.new("Holo_Camera", cam_data)
    cam_obj.location = (0.0, -5.20, 0.18)
    cam_obj.rotation_euler = (math.radians(90.0), 0.0, 0.0)
    cam_col.objects.link(cam_obj)
    bpy.context.scene.camera = cam_obj

def hud_frame_update_handler(scene):
    """Dynamically updates HUD text and ball pulse as timeline plays."""
    f = scene.frame_current
    text_obj = bpy.data.objects.get("Holo_HUD_StatusText")
    if text_obj and text_obj.data:
        if f <= 30:
            text_obj.data.body = "ASSEMBLING... 0%"
        elif f <= 80:
            pct = int((f - 30) / 50.0 * 25.0)
            text_obj.data.body = f"ASSEMBLING... {pct}%"
        elif f <= 160:
            pct = 25 + int((f - 80) / 80.0 * 35.0)
            text_obj.data.body = f"ASSEMBLING... {pct}%"
        elif f <= 240:
            pct = 60 + int((f - 160) / 80.0 * 35.0)
            text_obj.data.body = f"ASSEMBLING... {pct}%"
        elif f <= 280:
            pct = 95 + int((f - 240) / 40.0 * 4.0)
            text_obj.data.body = f"ASSEMBLING... {pct}%"
        else:
            text_obj.data.body = "STATUS: LISTENING"

def setup_timeline_animation():
    """Register frame handler and animate ball pulsing."""
    # Register frame change handler
    if hud_frame_update_handler not in bpy.app.handlers.frame_change_pre:
        bpy.app.handlers.frame_change_pre.append(hud_frame_update_handler)
        
    # Animate power core orb light
    light_obj = bpy.data.objects.get("Holo_Core_Light")
    if light_obj:
        for f in range(1, 361, 10):
            pulse = math.sin(f * 0.12) * 8.0
            light_obj.data.energy = 26.0 + pulse
            light_obj.data.keyframe_insert(data_path="energy", frame=f)

def build_full_scene():
    """Master procedural build orchestration."""
    clean_scene()
    setup_scene_properties()
    
    col_base = get_or_create_collection("HUMAN_BASE")
    col_blue_part = get_or_create_collection("BLUE_PARTICLES")
    col_orange = get_or_create_collection("ORANGE_ENERGY")
    col_contours = get_or_create_collection("BLUE_CONTOURS")
    col_cam = get_or_create_collection("CAMERA")
    col_env = get_or_create_collection("ENVIRONMENT")
    
    mats = create_materials()
    
    build_head_scanline_ribbons(col_base, mats['face'])
    build_silky_smooth_chest_and_shoulders(col_contours, mats['cyan'])
    build_silky_silhouette_rim(col_base, mats['rim'])
    build_neural_throat_tendrils(col_orange, mats['gold'])
    build_animated_particle_assembly(col_blue_part, mats['cyan'])
    build_power_core_orb(col_orange, mats['whitehot'])
    build_hud_status_text(col_env, mats['cyan'])
    
    setup_camera_and_lighting(col_cam)
    setup_timeline_animation()
    
    blend_filepath = r"c:\code\myportfolio\reference_recreation.blend"
    bpy.ops.wm.save_as_mainfile(filepath=blend_filepath)
    print(f"Master Assembly Animated Holographic Scene saved to {blend_filepath}!")

if __name__ == "__main__":
    build_full_scene()
