import { Camera, Star } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button, ModalShell, formControlFocusClass } from '../index.js'
import { resolveImageUrl } from '../../api/imageApi.js'

const blockedWords = ['씨발', '시발', '씨발년', '씨발놈', '쌍놈', '개새끼', '새끼', '존나', '좆', '씹', '병신', '지랄', '염병', '미친년', '미친놈', '호로', '호로새끼', '잡년', '화냥년', '육시랄', 'ㅆㅂ', 'ㅅㅂ', 'ㅂㅅ', 'ㅈㄴ', 'ㅈㄱㄴ', '시벌', '새키', '새끼야', '쌔끼', '존나게', '조온나', '좃', '죵나', '씨바', '씨방', '시바알', '씨벌', '18년', '18놈', '시8', '씨8', '개슥기', '개색기', '개섀끼', '맘충', '틀딱', '한남', '김치녀', '정공', '면상', '대가리', '주둥이', '주작', '꼴통', '먹튀', '사기꾼', '꺼져', '닥쳐', '껒여', '정신병자']
const xssPattern = /<script|javascript:|onerror=|onload=|iframe|object|embed/i

function validateReview(content) {
  const trimmed = content.trim()

  if (trimmed.length < 5) {
    return '상세 후기는 최소 5자 이상 입력해 주세요.'
  }

  if (xssPattern.test(trimmed)) {
    return '보안상 허용되지 않는 스크립트 또는 태그 패턴이 포함되어 있습니다.'
  }

  if (blockedWords.some((word) => trimmed.toLowerCase().includes(word))) {
    return '후기에 부적절한 표현이 포함되어 있습니다. 내용을 수정해 주세요.'
  }

  return ''
}

function StarSelector({ value, onChange }) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`${star}점`}
        >
          <Star
            className={`size-7 transition-colors ${
              star <= (hovered || value)
                ? 'fill-rating text-rating'
                : 'fill-border text-border-soft hover:fill-brand/40'
            }`}
            strokeWidth={0}
          />
        </button>
      ))}
      <span className="ml-2 text-body-sm text-muted">{value}점</span>
    </div>
  )
}

export default function ReviewFormModal({
  mode = 'create',
  product,
  initialValues = {},
  onClose,
  onSubmit,
  isSubmitting = false,
}) {
  const isCreate = mode === 'create'
  const fileInputRef = useRef(null)

  const [rating, setRating] = useState(initialValues.rating ?? 5)
  const [content, setContent] = useState(initialValues.content ?? '')
  const [existingImageUrl, setExistingImageUrl] = useState(initialValues.imageUrl ?? '')
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedFileName, setSelectedFileName] = useState('')
  const [previewImageUrl, setPreviewImageUrl] = useState('')
  const [isDragActive, setIsDragActive] = useState(false)
  const [validationMessage, setValidationMessage] = useState('')

  const displayPreviewUrl = previewImageUrl || resolveImageUrl(existingImageUrl)

  const clearSelectedFile = () => {
    if (previewImageUrl) {
      URL.revokeObjectURL(previewImageUrl)
    }
    setSelectedFile(null)
    setSelectedFileName('')
    setPreviewImageUrl('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const clearImage = () => {
    clearSelectedFile()
    setExistingImageUrl('')
  }

  useEffect(() => {
    return () => {
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl)
      }
    }
  }, [previewImageUrl])

  const handleFileSelect = (file) => {
    if (!file) return

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      clearSelectedFile()
      setValidationMessage('JPG 또는 PNG 이미지만 첨부할 수 있습니다.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      clearSelectedFile()
      setValidationMessage('이미지는 최대 5MB까지 첨부할 수 있습니다.')
      return
    }

    if (previewImageUrl) {
      URL.revokeObjectURL(previewImageUrl)
    }

    setSelectedFile(file)
    setSelectedFileName(file.name)
    setPreviewImageUrl(URL.createObjectURL(file))
    setValidationMessage('')
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragActive(false)
    handleFileSelect(event.dataTransfer.files?.[0])
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const message = validateReview(content)

    if (message) {
      setValidationMessage(message)
      return
    }

    onSubmit({
      rating,
      content,
      file: selectedFile ?? fileInputRef.current?.files?.[0] ?? null,
      imageUrl: existingImageUrl || null,
    })
  }

  const formattedDate = product?.orderDate
    ? new Date(product.orderDate).toLocaleDateString('ko-KR')
    : null

  return (
    <ModalShell
      title={isCreate ? '리뷰 작성' : '리뷰 수정'}
      titleId="review-modal-title"
      onClose={onClose}
      maxWidth="max-w-xl"
      bodyClassName="p-0"
    >
      <form className="text-ink" onSubmit={handleSubmit}>
        <div className="space-y-6 p-6">
          {product && (
            <section
              className="rounded-md border border-border p-5"
              aria-label="주문 상품 정보"
            >
              <div className="flex items-start gap-5">
                <img
                  className="size-24 shrink-0 rounded-md object-cover sm:size-28"
                  src={resolveImageUrl(product.imageUrl) || 'https://via.placeholder.com/300'}
                  alt={product.name}
                />

                <div className="min-w-0 flex-1">
                  {product.category && (
                    <p className="inline-flex bg-surface-muted px-2 py-1 text-caption font-bold">
                      {product.category}
                    </p>
                  )}

                  <h3 className={`text-body-lg font-medium ${product.category ? 'mt-2' : ''}`}>
                    {product.name}
                  </h3>

                  <div className="mt-2 space-y-1 text-body-sm text-foreground">
                    {product.orderId && (
                      <p>
                        주문번호:{' '}
                        <span className="font-semibold text-ink">#{product.orderId}</span>
                      </p>
                    )}
                    {formattedDate && <p>구매일: {formattedDate}</p>}
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="rounded-md border border-border p-5">
            <p className="text-body-lg font-bold">전체 평점</p>
            <div className="mt-4">
              <StarSelector value={rating} onChange={setRating} />
            </div>

            <label className="mt-8 block text-body-lg font-bold" htmlFor="review-content">
              상세 후기
            </label>
            <textarea
              id="review-content"
              className={`mt-4 h-panel w-full resize-none rounded-md border border-border bg-surface-muted p-6 text-body ${formControlFocusClass}`}
              placeholder="상품에 대한 솔직한 후기를 남겨주세요. (최소 5자 이상)"
              value={content}
              onChange={(event) => {
                setContent(event.target.value)
                setValidationMessage('')
              }}
            />

            <label className="mt-8 block text-body-lg font-bold" htmlFor="review-photo">
              사진 첨부
            </label>
            <div
              className={`relative mt-4 grid h-panel cursor-pointer place-items-center overflow-hidden rounded-md border-2 border-dashed text-center outline-none transition-colors ${isDragActive ? 'border-brand bg-brand-soft' : 'border-border bg-surface hover:border-ink'}`}
              role="button"
              tabIndex={0}
              onClick={(event) => {
                if (event.target !== fileInputRef.current) fileInputRef.current?.click()
              }}
              onDragEnter={(event) => {
                event.preventDefault()
                setIsDragActive(true)
              }}
              onDragOver={(event) => {
                event.preventDefault()
                setIsDragActive(true)
              }}
              onDragLeave={(event) => {
                event.preventDefault()
                setIsDragActive(false)
              }}
              onDrop={handleDrop}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  fileInputRef.current?.click()
                }
              }}
            >
              {displayPreviewUrl ? (
                <>
                  <img
                    className="absolute inset-0 size-full object-cover"
                    src={displayPreviewUrl}
                    alt={selectedFileName || '리뷰 이미지 미리보기'}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-ink/80 px-4 py-3 text-left text-white">
                    <p className="truncate text-caption font-medium">
                      {selectedFileName || '첨부된 이미지'}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p className="text-caption text-white/75">클릭하거나 새 이미지를 드래그해 교체</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="shrink-0 border border-white/70 text-white hover:bg-surface hover:text-ink"
                        onClick={(e) => {
                          e.stopPropagation()
                          clearImage()
                        }}
                      >
                        이미지 제거
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <Camera className="mx-auto mb-4 size-10 rounded-md bg-ink p-2 text-white" />
                  <p className="text-body-lg font-medium">이미지를 드래그하여 놓으세요</p>
                  <p className="mt-2 text-caption text-foreground">JPG, PNG 파일 (최대 5MB)</p>
                  <span className="mt-5 inline-flex border border-ink px-6 py-2 text-caption font-medium transition-colors hover:bg-surface-muted">
                    파일 찾기
                  </span>
                </div>
              )}
              <input
                className="sr-only"
                id="review-photo"
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                onClick={(event) => event.stopPropagation()}
                onChange={(event) => handleFileSelect(event.target.files?.[0])}
              />
            </div>

            {validationMessage && (
              <p
                className="mt-5 rounded border border-error-border bg-error-soft px-4 py-3 text-body-sm font-semibold text-error"
                role="alert"
              >
                {validationMessage}
              </p>
            )}
          </section>
        </div>

        <div className="flex justify-end border-t border-border-soft px-6 py-4">
          <Button type="submit" variant="primary" size="md" className="min-w-36" disabled={isSubmitting}>
            {isSubmitting ? '처리 중...' : isCreate ? '리뷰 등록하기' : '수정 완료'}
          </Button>
        </div>
      </form>
    </ModalShell>
  )
}
