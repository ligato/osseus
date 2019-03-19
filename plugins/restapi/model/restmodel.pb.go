// Code generated by protoc-gen-gogo. DO NOT EDIT.
// source: restmodel.proto

package model

import (
	fmt "fmt"
	proto "github.com/gogo/protobuf/proto"
	math "math"
)

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.GoGoProtoPackageIsVersion2 // please upgrade the proto package

type Plugin struct {
	PluginName           string   `protobuf:"bytes,1,opt,name=pluginName,proto3" json:"pluginName,omitempty"`
	Id                   int32    `protobuf:"varint,2,opt,name=id,proto3" json:"id,omitempty"`
	Selected             bool     `protobuf:"varint,3,opt,name=selected,proto3" json:"selected,omitempty"`
	Image                string   `protobuf:"bytes,4,opt,name=image,proto3" json:"image,omitempty"`
	Port                 int32    `protobuf:"varint,5,opt,name=port,proto3" json:"port,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *Plugin) Reset()         { *m = Plugin{} }
func (m *Plugin) String() string { return proto.CompactTextString(m) }
func (*Plugin) ProtoMessage()    {}
func (*Plugin) Descriptor() ([]byte, []int) {
	return fileDescriptor_5308a14fe03634ec, []int{0}
}
func (m *Plugin) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_Plugin.Unmarshal(m, b)
}
func (m *Plugin) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_Plugin.Marshal(b, m, deterministic)
}
func (m *Plugin) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Plugin.Merge(m, src)
}
func (m *Plugin) XXX_Size() int {
	return xxx_messageInfo_Plugin.Size(m)
}
func (m *Plugin) XXX_DiscardUnknown() {
	xxx_messageInfo_Plugin.DiscardUnknown(m)
}

var xxx_messageInfo_Plugin proto.InternalMessageInfo

func (m *Plugin) GetPluginName() string {
	if m != nil {
		return m.PluginName
	}
	return ""
}

func (m *Plugin) GetId() int32 {
	if m != nil {
		return m.Id
	}
	return 0
}

func (m *Plugin) GetSelected() bool {
	if m != nil {
		return m.Selected
	}
	return false
}

func (m *Plugin) GetImage() string {
	if m != nil {
		return m.Image
	}
	return ""
}

func (m *Plugin) GetPort() int32 {
	if m != nil {
		return m.Port
	}
	return 0
}

func init() {
	proto.RegisterType((*Plugin)(nil), "model.Plugin")
}

func init() { proto.RegisterFile("restmodel.proto", fileDescriptor_5308a14fe03634ec) }

var fileDescriptor_5308a14fe03634ec = []byte{
	// 145 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0xe2, 0xe2, 0x2f, 0x4a, 0x2d, 0x2e,
	0xc9, 0xcd, 0x4f, 0x49, 0xcd, 0xd1, 0x2b, 0x28, 0xca, 0x2f, 0xc9, 0x17, 0x62, 0x05, 0x73, 0x94,
	0xea, 0xb8, 0xd8, 0x02, 0x72, 0x4a, 0xd3, 0x33, 0xf3, 0x84, 0xe4, 0xb8, 0xb8, 0x0a, 0xc0, 0x2c,
	0xbf, 0xc4, 0xdc, 0x54, 0x09, 0x46, 0x05, 0x46, 0x0d, 0xce, 0x20, 0x24, 0x11, 0x21, 0x3e, 0x2e,
	0xa6, 0xcc, 0x14, 0x09, 0x26, 0x05, 0x46, 0x0d, 0xd6, 0x20, 0xa6, 0xcc, 0x14, 0x21, 0x29, 0x2e,
	0x8e, 0xe2, 0xd4, 0x9c, 0xd4, 0xe4, 0x92, 0xd4, 0x14, 0x09, 0x66, 0x05, 0x46, 0x0d, 0x8e, 0x20,
	0x38, 0x5f, 0x48, 0x84, 0x8b, 0x35, 0x33, 0x37, 0x31, 0x3d, 0x55, 0x82, 0x05, 0x6c, 0x0c, 0x84,
	0x23, 0x24, 0xc4, 0xc5, 0x52, 0x90, 0x5f, 0x54, 0x22, 0xc1, 0x0a, 0x36, 0x03, 0xcc, 0x4e, 0x62,
	0x03, 0xbb, 0xc6, 0x18, 0x10, 0x00, 0x00, 0xff, 0xff, 0xa2, 0x47, 0x8f, 0x6e, 0xa0, 0x00, 0x00,
	0x00,
}
