"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

import { Button } from "antd"
import { Input } from "antd"
import { Label } from "antd"
import { Textarea } from "antd"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "antd"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "antd"

export default function CreatePostPage() {
  const [postType, setPostType] = useState("blog")

  return (
    <div className="container px-4 py-6 mx-auto">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/forum" className="flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Quay lại diễn đàn
          </Link>
        </Button>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Tạo bài viết mới</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="post-type">Loại bài viết</Label>
            <Select defaultValue="blog" onValueChange={setPostType}>
              <SelectTrigger id="post-type">
                <SelectValue placeholder="Chọn loại bài viết" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blog">Blog</SelectItem>
                <SelectItem value="question">Hỏi đáp</SelectItem>
                <SelectItem value="discussion">Thảo luận</SelectItem>
                <SelectItem value="job">Cơ hội việc làm</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input id="title" placeholder="Nhập tiêu đề bài viết" />
          </div>

          {postType === "job" && (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company">Tên công ty</Label>
                  <Input id="company" placeholder="Tên công ty" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Địa điểm</Label>
                  <Input id="location" placeholder="Địa điểm làm việc" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="salary">Mức lương</Label>
                  <Input id="salary" placeholder="Mức lương (VNĐ)" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Hạn nộp hồ sơ</Label>
                  <Input id="deadline" type="date" />
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="category">Lĩnh vực/Ngành nghề</Label>
            <Select defaultValue="it">
              <SelectTrigger id="category">
                <SelectValue placeholder="Chọn lĩnh vực" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="it">Công nghệ thông tin</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="finance">Tài chính - Kế toán</SelectItem>
                <SelectItem value="design">Thiết kế</SelectItem>
                <SelectItem value="engineering">Kỹ thuật</SelectItem>
                <SelectItem value="other">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Nội dung</Label>
            <Textarea id="content" placeholder="Nhập nội dung bài viết" className="min-h-[300px]" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Thẻ (tags)</Label>
            <Input id="tags" placeholder="Nhập các thẻ, phân cách bằng dấu phẩy (ví dụ: cntt, tuyendung, kynangmem)" />
            <p className="text-xs text-muted-foreground">Thẻ giúp bài viết của bạn dễ dàng được tìm thấy hơn</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Lưu nháp</Button>
          <Button>Đăng bài</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
